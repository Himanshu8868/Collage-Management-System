const WeeklySchedule = require("../models/WeeklySchedule");

// Create Weekly Schedule
const createWeeklySchedule = async (req, res) => {
  try {
    const { course, semester, entries } = req.body;
    const createdBy = req.user?._id;

    // Validate required fields
    if (!course || !semester || !entries) {
      return res.status(400).json({
        success: false,
        message: "Course, semester and entries are required fields"
      });
    }

    // Check if schedule already exists
    const existingSchedule = await WeeklySchedule.findOne({ course, semester });
    if (existingSchedule) {
      return res.status(409).json({
        success: false,
        message: "Schedule already exists for this course and semester"
      });
    }

    const schedule = await WeeklySchedule.create({ 
      course, 
      semester, 
      entries, 
      createdBy 
    });

    res.status(201).json({ 
      success: true, 
      message: "Weekly schedule created successfully", 
      schedule 
    });

  } catch (error) {
    console.error('Create Schedule Error:', error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to create schedule",
      message: error.message 
    });
  }
};

// Get Weekly Schedule by Course & Semester
const getWeeklySchedule = async (req, res) => {
  try {
    const { course, semester } = req.user; 

    if (!course || !semester) {
      return res.status(400).json({
        success: false,
        message: "Course and semester not found for user"
      });
    }

    const schedule = await WeeklySchedule.findOne({ course, semester })
      .populate("createdBy", "name")
      .lean();

    if (!schedule) {
      return res.status(404).json({ 
        success: false, 
        message: "Schedule not found for the specified course and semester" 
      });
    }

    res.status(200).json({ 
      success: true, 
      schedule 
    });

  } catch (error) {
    console.error('Get Schedule Error:', error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch schedule",
      message: error.message 
    });
  }
};


module.exports = {
  createWeeklySchedule,
  getWeeklySchedule,
};