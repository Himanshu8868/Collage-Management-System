const Exam = require('../models/Exam');
const Course = require('../models/Course');
const Result = require('../models/Result');
const User = require('../models/User');
// const { validationResult } = require('express-validator');

const createExam = async (req, res) => {
    try {
        const { code, title, date, duration, questions } = req.body;

        // Find the course using exam code instead of courseId
        const course = await Course.findOne({ code });
        if (!course) {
            return res.status(400).json({ message: "Invalid exam code" });
        }

        // Ensure the faculty is assigned to this course
        if (String(course.instructor) !== String(req.user.id)) {
            return res.status(403).json({ message: "Not authorized to create exams for this course" });
        }

        // Create the exam without requiring courseId
        const exam = await Exam.create({
            course: course._id, // Store course reference
            title,
            date,
            duration,
            questions
        });

        res.status(201).json({ success: true, message: "Exam created successfully", exam });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update exam // 

const UpdateExam = async (req, res) => {
    try {
        const examId = req.params.id; // Extract exam ID from URL
        const { title, date, questions } = req.body; // Extract updated data

        // Find the exam and update it
        const updatedExam = await Exam.findByIdAndUpdate(
            examId,
            { title, date, questions },
            { new: true, runValidators: true }
        );

        if (!updatedExam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        res.status(200).json({ success: true, message: "Exam updated successfully", exam: updatedExam });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

//: Instructor requests exam deletion By exam id
 const RequestDelete = async (req, res) => {
    const { examId } = req.params;
    try {
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (exam.deleteRequested) {
            return res.status(400).json({ message: "Delete request has already been made" });
        }

        // Mark the exam as requested for deletion
        exam.deleteRequested = true;
        await exam.save();

        return res.status(200).json({ message: "Exam deletion request submitted successfully" });

    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

//   Pending request for Exam Deletation //
const GetPendingExams = async (req, res) => {
    try {
        // Fetch exams that have been requested for deletion
        const pendingExams = await Exam.find({ deleteRequested: true, deletedByAdmin: { $ne: true } })
        .populate({
            path: 'course',
            populate: {
              path: 'instructor'
            }
          })          
        return res.status(200).json(pendingExams);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};




// Delate exam By Admin by exam id
    const DeleteExam =  async (req, res) => {
    const { examId } = req.params;

    try {
        // Check if the exam exists
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Ensure the delete request was made by an instructor
        if (!exam.deleteRequested) {
            return res.status(400).json({ message: "Exam was not requested for deletion" });
        }

        // Admin approves the deletion and removes the exam
        if (exam.deletedByAdmin) {
            return res.status(400).json({ message: "Exam has already been deleted by admin" });
        }

        // Mark the exam as deleted by admin
        exam.deletedByAdmin = true;

        // Delete the exam
        await exam.deleteOne();

        return res.status(200).json({ message: "Exam deleted successfully" });

    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};         

// Exam can see only the techer and edit //

const Details = async (req, res) => {
    try {
        // Get instructor ID from authenticated user
        const facultyId = req.user.id;

        // Find all courses that this instructor is teaching
        const courses = await Course.find({ instructor: facultyId }).populate('instructor', 'name');

        if (!courses.length) {
            return res.status(200).json({ success: true, message: "No courses found for your faculty", exams: [] });
        }

        // Extract course IDs
        const courseIds = courses.map(course => course._id);

        // Find exams related to the courses taught by this instructor
        const exams = await Exam.find({ course: { $in: courseIds } }).populate('course');

        if (!exams.length) {
            return res.status(200).json({ success: true, message: "No exams found for your courses", exams: [] });
        }

        // Return the exam details
        res.status(200).json({ success: true, message: "Exam details fetched successfully", exams });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


//Get all exam for a Course 

const getExams = async (req, res) => {
    const courseId = req.params.courseId;
    try {
        const exam = await Exam.find({ course: courseId }).populate("course", "name");
        res.status(200).json({ success: true, exam });
        if (!exam) {
            return res.status(404).json({ message: "No exam found" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//get all exmas details //

const examDetails = async (req, res) => {
    try {
        const Exams = await Exam.find()
            .populate({
                path:"course",
                  populate:{
                    path:"instructor",
                    select:"name"
                  }
            })
        if (Exams) {
            res.status(200).json({ success: true, Exams });
        }
        else {
            return res.status(404).json({ message: "No exam found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get a specific exam
const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id).populate("course", "name");

        if (!exam) return res.status(404).json({ message: "Exam not found" });

        res.json(exam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Student submits exam answers
// const submitExam = async (req, res) => {
//     try {
//         const { answers } = req.body;
//         const exam = await Exam.findById(req.params.id).populate("course" , "name") .populate("student" , "name");
//         const user = await User.findById(req.user.id)
//         if (!user) return res.status(404).json({ message: "student not found" });

//         if (!exam) return res.status(404).json({ message: "Exam not found" });

//         let score = 0;
//         answers.forEach((ans) => {
//             const question = exam.questions.find((q) => String(q._id) === ans.questionId);
//             if (question && question.correctAnswer === ans.selectedOption) {
//                 score += 1;
//             }
//         });

//         const result = await Result.create({
//             student: req.user.id,
//             exam: req.params.id,
//             course: exam.course,
//             answers,
//             score,
//         });

//         res.status(201).json({ message: "Exam submitted successfully", score , result });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };
const submitExam = async (req, res) => {
    try {
        const { answers } = req.body;

        // Fetch exam with course and student details
        const exam = await Exam.findById(req.params.id)
            .populate("course", "name")
            .populate("student", "name");

        if (!exam) return res.status(404).json({ message: "Exam not found" });

        // Fetch student (user)
        const student = await User.findById(req.user.id).select("name");
        if (!student) return res.status(404).json({ message: "Student not found" });

        let score = 0;
        let detailedAnswers = [];

        // Loop through each answer and match with the correct answer
        answers.forEach((ans) => {
            const question = exam.questions.find((q) => String(q._id) === ans.questionId);
            if (question) {
                const isCorrect = question.correctAnswer === ans.selectedOption;
                if (isCorrect) score += 1;

                // Store detailed answer info
                detailedAnswers.push({
                    questionText: question.questionText,
                    selectedOption: ans.selectedOption,
                    correctAnswer: question.correctAnswer,
                    isCorrect,
                });
            }
        });

        // Save result in database
        const result = await Result.create({
            student: req.user.id,
            studentName: student.name, // Save student name
            exam: req.params.id,
            course: exam.course,
            answers: detailedAnswers,
            score,
        });

        // Send response with detailed info
        res.status(201).json({
            message: "Exam submitted successfully",
            student: student.name,
            score,
            result
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get student results
const getResultsByStudent = async (req, res) => {
    try {
        const results = await Result.find({ student: req.params.id })
            .populate("exam", "title")
            .populate("student", "name")
        if (results.length === 0) {
            return res.status(404).json({ message: " No result found for this student" });
        }
        res.status(200).json({ success: true, message: "result found ", results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get all results for an exam

const getResultsByExam = async (req, res) => {
    try {
        const results = await Result.find({ exam: req.params.id })
            .populate("student", "name email")
            .populate("exam", "title");

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createExam,
    UpdateExam,
    RequestDelete,
    GetPendingExams,
    DeleteExam,
    examDetails,
    Details,  // filter instructor based on their sub
    getExams,
    getExamById,
    submitExam,
    getResultsByStudent,
    getResultsByExam
}