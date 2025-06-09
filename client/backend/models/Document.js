const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fileUrl: { type: String, required: true },
  type: { type: String, enum: ["syllabus", "notes", "assignment"], required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Document", documentSchema);
