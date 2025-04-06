const mongoose = require('mongoose');
const ExamSchema = new mongoose.Schema({

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
  
     student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
     },

    title: {
        type: String,
        required: true,
        trim: true,
    },

    date: {
        type: Date,
        required: true,
        trim: true,
    },
      
    duration:{
        type:String,
    },
    
    deleteRequested: { type: Boolean, default: false },
    deletedByAdmin: { type: Boolean, default: false }, // Will be set to true when admin deletes the exam
    
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String }],
            correctAnswer: { type: String, required: true },
        },
    ],
},

        { timestamps: true }
);

const Exam = mongoose.model('Exam', ExamSchema);
module.exports = Exam;