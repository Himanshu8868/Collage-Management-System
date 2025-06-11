const mongoose = require("mongoose");

const scheduleEntrySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: { type: String, required: true }, // "09:00"
  endTime: { type: String, required: true },   // "10:00"
  subject: { type: String, required: true },
  faculty: { type: String },
  location: { type: String },
});

const weeklyScheduleSchema = new mongoose.Schema({
course: { type: String, required: true },
  semester: { type: String, required: true },
  entries: [scheduleEntrySchema], // Array of daily entries
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("WeeklySchedule", weeklyScheduleSchema);
