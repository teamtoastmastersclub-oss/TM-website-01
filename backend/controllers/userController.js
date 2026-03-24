import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').lean();
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.branch = req.body.branch || user.branch;
      user.sem = req.body.sem || user.sem;
      user.usn = req.body.usn || user.usn;
      user.email = req.body.email || user.email;
      if (req.body.mobile !== undefined) user.mobile = req.body.mobile;
      if (req.body.profileImage !== undefined) {
        user.profileImage = req.body.profileImage;
      }

      if (req.body.password) {
        // Assume password hashing is handled in pre-save hook, 
        // OR we can manually hash here if the pre-save doesn't exist.
        // The original logic hashed inside authController signup. We handle it here manually.
        const bcrypt = await import('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        branch: updatedUser.branch,
        sem: updatedUser.sem,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Admin: Get all users
export const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { usn: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// Admin: Toggle suspend user
export const toggleSuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot suspend another admin.' });
    
    user.isSuspended = !user.isSuspended;
    await user.save();
    
    res.json({ message: user.isSuspended ? 'User has been suspended.' : 'User suspension lifted.', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error suspending user' });
  }
};

// Admin: Delete user completely
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete another admin.' });
    
    await user.deleteOne();
    res.json({ message: 'User permanently deleted from the club records.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

// Authenticated: Change Password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: 'Password must have uppercase, lowercase, number, and special character.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });
    
    const isSameMatch = await bcrypt.compare(newPassword, user.password);
    if (isSameMatch) {
      return res.status(400).json({ message: 'Enter different password as this is same to previous pass.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating password' });
  }
};
