const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // Format: "HH:mm"
  endTime: { type: String, required: true },   // Format: "HH:mm"
  location: { type: String },

  // Course and Semester targeting
  course: {
    type: String,
    required: true,
    enum: ['BCA', 'BTech', 'MCA', 'MBA', 'Other'] // Add more if needed
  },
  semester: {
    type: String,
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);
