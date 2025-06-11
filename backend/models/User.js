const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
        rollNo: {
            type: String,
            required: function() { return this.role === "student"; },
            unique: function() { return this.role === "student"; }
        },  
        // batch: { 
        //     type: String, 
        //     required: function() { return this.role === "student"; },
        //     enum: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        // },

        semester: {type : String ,
         required : function() { return this.role === "student"}} ,
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

            resetToken: String,
            resetTokenExpire: Date,
    },
    { timestamps: true }

);

    // Password hash middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
