import Team from '../models/Team.js';
import User from '../models/User.js';

export const getTeam = async (req, res) => {
  try {
    let team = await Team.findOne();
    if (!team) {
      team = await Team.create({
         principal: {}, faculties: [], coordinators: []
      });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching team' });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { principal, faculties, coordinators } = req.body;
    
    // Process coordinators to fetch their latest data from User collection
    const processedCoordinators = await Promise.all((coordinators || []).map(async (coord) => {
      const usnFormatted = coord.usn ? coord.usn.trim().toUpperCase() : '';
      const user = await User.findOne({ usn: usnFormatted });
      if (user) {
        return {
          usn: usnFormatted,
          title: coord.title,
          name: user.fullName || user.username || '',
          profileImage: user.profileImage || '',
          branch: user.branch || '',
          sem: user.sem || ''
        };
      }
      return {
          usn: usnFormatted,
          title: coord.title,
          name: coord.name || 'User Not Found',
          profileImage: coord.profileImage || '',
          branch: coord.branch || '',
          sem: coord.sem || ''
      };
    }));

    let team = await Team.findOne();
    if (!team) {
      team = new Team();
    }
    
    if (principal) team.principal = principal;
    if (faculties) team.faculties = faculties;
    if (coordinators) team.coordinators = processedCoordinators;

    await team.save();
    res.json(team);
  } catch (error) {
    console.error("Team Update Error:", error);
    res.status(500).json({ message: 'Server error updating team' });
  }
};
