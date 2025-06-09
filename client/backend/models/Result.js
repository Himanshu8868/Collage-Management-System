const mongoose = require('mongoose');
const ResultSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
            instructor: { type: mongoose.Schema.Types.ObjectId, ref: "Course"},
    
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
            selectedOption: { type: String, required: true },
        },
    ],
    score: { type: Number, default: 0 },
},
    { timestamps: true }
)
const Result = mongoose.model('Result', ResultSchema);
module.exports = Result;
