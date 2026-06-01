import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Settings from '../models/Settings.js';
import OTP from '../models/OTP.js';

// Helper to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d', // 7 days
  });
};

// Detect production: NODE_ENV=production OR a custom FRONTEND_URL is configured (e.g. on Render)
const isProduction = () =>
  process.env.NODE_ENV === 'production' || !!process.env.FRONTEND_URL;

// Helper to set auth cookie consistently across environments
const setAuthCookie = (res, token) => {
  const prod = isProduction();
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: prod,                         // HTTPS required for sameSite:none
    sameSite: prod ? 'none' : 'strict',   // 'none' is required for cross-domain cookies
    maxAge: 7 * 24 * 60 * 60 * 1000      // 7 days
  });
};

// Helper to clear auth cookie with matching attributes
const clearAuthCookie = (res) => {
  const prod = isProduction();
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: prod,
    sameSite: prod ? 'none' : 'strict',
    expires: new Date(0)
  });
};

export const signup = async (req, res) => {
  try {
    const { email, password, fullName, usn, branch, sem } = req.body;
    if (!email || !password || !fullName || !usn || !branch || !sem) return res.status(400).json({ message: 'All fields are required' });

    let user = await User.findOne({ $or: [{ email }, { usn: new RegExp(`^${usn}$`, 'i') }] });
    if (user) {
      if (user.email === email.toLowerCase()) return res.status(400).json({ message: 'An account with this Email already exists' });
      return res.status(400).json({ message: 'An account with this USN already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword, fullName, usn, branch, sem });
    await user.save();

    const token = generateToken(user._id);

    setAuthCookie(res, token);

    // Dispatch Welcome Email via Brevo API
    try {
      let authSettings = await Settings.findOne({ isSeeded: true });
      let senderEmail = process.env.EMAIL_USER || authSettings?.brevoSenderEmail || "masoommulla14@gmail.com";
      
      const apiKey = process.env.BREVO_API_KEY;
      if (apiKey) {
        const htmlContent = `<div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
            <p>Hi ${fullName},</p>
            <p>Welcome to the Toastmasters Club! 🎉</p>
            <p>We’re truly excited to have you join our community of learners, leaders, and confident speakers.</p>
            <p>At Toastmasters, you’ll get the opportunity to:</p>
            <p>• Build strong communication and public speaking skills<br>
            • Develop leadership abilities<br>
            • Participate in engaging activities and real-world practice sessions</p>
            <p>You can now log in to your member dashboard to:</p>
            <p>• Complete your profile<br>
            • Stay updated with upcoming sessions and events<br>
            • Start your journey toward becoming a confident speaker</p>
            <p>We encourage you to actively participate, explore, and make the most of this experience.</p>
            <p>If you have any questions, feel free to reach out — we’re here to support you!</p>
            <p>Looking forward to seeing you grow and shine 🌟</p>
            <br>
            <p>Best regards,<br>Team Toastmasters</p>
          </div>`;

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: "Team Toastmasters", email: senderEmail },
            to: [{ email: email }],
            subject: "Welcome to Toastmasters Club!",
            htmlContent: htmlContent
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Brevo Error:", errorData);
        } else {
          console.log(`Welcome email sent to ${email}`);
        }
      } else {
        console.warn("BREVO_API_KEY not configured. Welcome email skipped.");
      }
    } catch (emailErr) {
      console.error('Welcome Email failed catch:', emailErr);
    }

    res.status(201).json({ message: 'Signup successful', user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ 
      $or: [{ email: email }, { username: email }] 
    });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (user.isSuspended) return res.status(403).json({ message: 'Account is suspended by administrator.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    setAuthCookie(res, token);

    res.status(200).json({ message: 'Login successful', user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res) => {
  try {
    const { usn, isAdmin } = req.body;
    let user;
    if (isAdmin) {
      user = await User.findOne({ role: 'admin' });
    } else {
      if (!usn) return res.status(400).json({ message: 'USN is required' });
      user = await User.findOne({ usn: usn.toUpperCase() });
    }

    if (!user) return res.status(404).json({ message: 'User not found in our records.' });
    
    // Safety check if user has no email
    if (!user.email) return res.status(400).json({ message: 'User does not have an attached email.' });
    const email = user.email;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins

    await OTP.deleteMany({ email });
    await OTP.create({ email, otp, expiresAt });

    let authSettings = await Settings.findOne({ isSeeded: true });
    let senderEmail = process.env.EMAIL_USER || authSettings?.brevoSenderEmail || "masoommulla14@gmail.com";

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error(`[ERROR] BREVO_API_KEY not found in env variables.`);
      return res.status(500).json({ message: 'Email credentials missing. Cannot send OTP.' });
    }

    try {
      const htmlContent = `<div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
          <p>Hello,</p>
          <p>We received a request to reset your password for your Toastmasters account.</p>
          <p>To proceed, please use the One-Time Password (OTP) below:</p>
          <p style="font-size: 24px; font-weight: bold; margin: 20px 0;">🔑 ${otp}</p>
          <p>⏳ This OTP is valid for the next 2 minutes.</p>
          <p>For your security:</p>
          <p>• Do not share this OTP with anyone<br>
          • Our team will never ask for your OTP</p>
          <p>If you did not request this password reset, please ignore this email or contact us immediately.</p>
          <p>Stay safe and secure.</p>
          <br>
          <p>Best regards,<br>Team Toastmasters</p>
        </div>`;

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: "Team Toastmasters", email: senderEmail },
          to: [{ email: email }],
          subject: "Your OTP for Password Reset",
          htmlContent: htmlContent
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Brevo Error:", errorData);
        return res.status(500).json({ message: 'Email service temporarily unavailable. Please try again later.' });
      }

      res.status(200).json({ message: 'OTP sent successfully to your registered email.' });
    } catch (emailErr) {
      console.error('Brevo API Catch Error:', emailErr);
      return res.status(500).json({ message: 'Email service temporarily unavailable. Please try again later.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { usn, isAdmin, otp } = req.body;
    
    let identifierEmail;
    if (isAdmin) {
      const u = await User.findOne({ role: 'admin' });
      identifierEmail = u?.email;
    } else {
      if (!usn) return res.status(400).json({ message: 'USN required' });
      const u = await User.findOne({ usn: usn.toUpperCase() });
      if (!u) return res.status(404).json({ message: 'User not found.' });
      identifierEmail = u.email;
    }

    const record = await OTP.findOne({ email: identifierEmail, otp });
    if (!record) return res.status(400).json({ message: 'Invalid Verification OTP.' });
    
    if (record.expiresAt < new Date()) {
      await OTP.deleteMany({ email: identifierEmail });
      return res.status(400).json({ message: 'OTP has expired. Please request a new code.' });
    }
    res.json({ message: 'OTP verified successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { usn, isAdmin, newPassword, otp } = req.body;
    
    // 1. Password Strength Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: 'Password must have uppercase, lowercase, number, and special character.' });
    }

    // 2. Resolve target email
    let identifierEmail;
    let targetUser;
    if (isAdmin) {
      targetUser = await User.findOne({ role: 'admin' });
      identifierEmail = targetUser?.email;
    } else {
      if (!usn) return res.status(400).json({ message: 'USN required' });
      targetUser = await User.findOne({ usn: usn.toUpperCase() });
      if (!targetUser) return res.status(404).json({ message: 'User not found.' });
      identifierEmail = targetUser.email;
    }

    const record = await OTP.findOne({ email: identifierEmail, otp });
    
    // Strict backend secondary verification
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP session. Please restart process.' });
    }
    
    // 3. New != Old Verification
    const isMatch = await bcrypt.compare(newPassword, targetUser.password);
    if (isMatch) {
      return res.status(400).json({ message: 'Enter different password as this is same to previous pass.' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await User.updateOne({ email: identifierEmail }, { password: hashedPassword });
    await OTP.deleteMany({ email: identifierEmail }); // Terminate OTP tokens
    
    res.json({ message: 'Password reset completely successful. Proceed to login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
