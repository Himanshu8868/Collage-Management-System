const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        enrollYear: { type: String, required: true },
        endYear: { type: String, required: true },
        Department: { type: String, required: true },
        HOD: { type: String, required: true },
        
        role: {
            type: String,
            enum: ["admin", "faculty", "student"],
            default: "student",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
