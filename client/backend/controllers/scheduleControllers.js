const Schedule = require("../models/Schedule");

// Create Schedule
const createSchedule = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, location, course, semester } = req.body;
    const createdBy = req.user._id; 

    const schedule = await Schedule.create({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      course,
      semester,
      createdBy
    });

    res.status(201).json({ success: true, message: "Schedule created", schedule });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create schedule" });
  }
};

// Get schedules for student by course & semester
const getStudentSchedule = async (req, res) => {
  try {
    const { course, semester } = req.user; // from auth middleware
    const schedules = await Schedule.find({ course, semester }).sort({ date: 1 });

    res.status(200).json({ success: true, schedules });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch schedule" });
  }
};

// Get all schedules (for admin/faculty)
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ date: 1 }).populate('createdBy', 'name email');
    res.status(200).json({ success: true, schedules });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to get all schedules" });
  }
};

// Delete schedule
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ success: false, error: "Not found" });

    res.status(200).json({ success: true, message: "Schedule deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete" });
  }
};

module.exports = {
  createSchedule,
  getStudentSchedule,
  getAllSchedules,
  deleteSchedule
};
