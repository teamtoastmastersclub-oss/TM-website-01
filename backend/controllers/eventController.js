import Event from '../models/Event.js';
import User from '../models/User.js';

// PUBLIC: Get all events (can filter by status on frontend)
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('attendees', 'fullName usn branch sem profileImage username')
      .populate('winners.user', 'fullName usn branch sem profileImage username')
      .sort({ createdAt: -1 })
      .lean();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// PUBLIC: Get single event
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('attendees', 'fullName usn branch sem profileImage')
      .populate('winners.user', 'fullName usn branch sem profileImage')
      .lean();
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

// ADMIN: Create Event
export const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

// ADMIN: Toggle Attendance (Pushing/Pulling User IDs from attendees array)
export const toggleAttendance = async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Check if user is already present
    const index = event.attendees.findIndex(id => id.toString() === userId.toString());
    if (index === -1) {
      event.attendees.push(userId); // Mark Present
    } else {
      event.attendees.splice(index, 1); // Mark Absent
    }
    
    await event.save();
    const updated = await Event.findById(eventId).populate('attendees', 'fullName usn branch sem profileImage');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling attendance', error: error.message });
  }
};

// ADMIN: Move to Past (Accepts advanced Form Data)
export const moveToPast = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { winnersData, gallery } = req.body; // winnersData: [{usn, title, image}]
    
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const winners = [];
    if (winnersData && winnersData.length > 0) {
      for (const w of winnersData) {
        if (!w.usn) continue;
        const u = await User.findOne({ usn: w.usn.trim().toUpperCase() });
        if (u) {
          winners.push({ user: u._id, title: w.title || '', image: w.image || '' });
        }
      }
    }

    event.status = 'past';
    event.winners = winners;
    if (gallery && gallery.length > 0) {
      event.gallery = gallery;
    }

    await event.save();
    
    const updated = await Event.findById(eventId)
      .populate('attendees', 'fullName usn branch sem profileImage')
      .populate('winners.user', 'fullName usn branch sem profileImage');
      
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error archiving event', error: error.message });
  }
};

// ADMIN: Delete Event Permanently
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event permanently purged securely.' });
  } catch (error) {
    res.status(500).json({ message: 'Error purging event', error: error.message });
  }
};
