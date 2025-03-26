const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        
        code: { type: String, required: true, unique: true },
        description: { type: String },
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
