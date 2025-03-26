const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
        date: { type: Date, required: true, default: Date.now },
        status: { type: String, enum: ["Present", "Absent"], required:[true , "status is required" ]},
    },
    { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
