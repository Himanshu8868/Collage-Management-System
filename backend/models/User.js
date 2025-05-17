const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
         course: { 
        type: String, 
        required: function() { return this.role === "student"; },
        enum: ['BCA', 'BTech', 'MCA', 'MBA', 'Other'],
    },
        // year: {type : String , required: true},
        semester: {type : String , required : true} ,
        enrollYear: { 
            type: String, 
            required: function() { return this.role === "student"; } 
        },
        endYear: { 
            type: String, 
            required: function() { return this.role === "student"; }  
        },
        department: { type: String },
        HOD: { type: String },
        
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Inactive',
          },
          
          approvalStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: function() {
                return this.role === 'faculty' ? 'pending' : 'approved';
            }
        },

        role: {
            type: String,
            enum: ["admin", "faculty", "student"],
            default: "student",
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
