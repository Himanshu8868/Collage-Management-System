const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        enrollYear: { 
            type: String, 
            required: function() { return this.role === "student"; } 
        },
        endYear: { 
            type: String, 
            required: function() { return this.role === "student"; }  
        },
        Department: { type: String },
        HOD: { type: String },
        
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active'
          },
          
        role: {
            type: String,
            enum: ["admin", "faculty", "student"],
            default: "student",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
