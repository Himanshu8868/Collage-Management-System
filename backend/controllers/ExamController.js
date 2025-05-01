const Exam = require('../models/Exam');
const Course = require('../models/Course');
const Result = require('../models/Result');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');

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

        // Map the correctAnswer index to the actual option text
        const formattedQuestions = questions.map((q) => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.options[parseInt(q.correctAnswer)] // convert "0" → "GET", etc.
        }));

        // Create the exam
        const exam = await Exam.create({
            course: course._id,
            title,
            date,
            duration,
            questions: formattedQuestions
        });

         
        // Notify the admin about the new exam creation
         const user = await User.findById(req.user._id);

        await Activity.create({
            user: req.user._id,
            action: `New exam ${exam.title} has been created for course ${course.name} by : ${user.name}.`,
            type: "exam"
        });

        res.status(201).json({
            success: true,
            message: "Exam created successfully",
            exam
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET /api/exams/ for Student enrolled 
const getStudentExams = async (req, res) => {
    try {
        const studentId = req.user.id; 

        // Step 1: Find courses where this student is enrolled
        const courses = await Course.find({ studentsEnrolled: studentId });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "You are not enrolled in any courses." });
        }

        const courseIds = courses.map(course => course._id);

        // Step 2: Find exams linked to those courses
        const exams = await Exam.find({ course: { $in: courseIds } })
            .populate("course", "name code");

        res.status(200).json({ success: true, exams });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
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

         // Notify the admin about the deletion request
         const admins = await User.find({ role: 'admin' }); // adjust role field as per your schema
         const adminIds = admins.map(admin => admin._id);

         
            await Notification.create({
            userId: req.user._id,
            receiverIds: adminIds, // Assuming the admin is the one who created the exam
            title: "Exam Deletion Request",
            message: `Instructor ${req.user.name} has requested to delete the exam "${exam.title}".`,
            link: `/exam-deletaiton-approved-page` // Link to the admin panel for exam management
        });
         
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

          // Notification For faculty //
           
          await Notification.create({
            userId: req.user._id,
            receiverIds: pendingExams.map(exam => exam.course.instructor._id), // Assuming the instructor is the one who created the exam
            title: "Compleated Exam Deletion Request",
            message: `The following exams have been requested for deletion was approved by ${req.user.name}: ${pendingExams.map(exam => exam.title).join(", ")}`,
            link: `/exam-deletion-pending-page` // Link to the admin panel for exam management
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
        const exam = await Exam.findById(req.params.id)
        .populate({
            path:"course",
              populate:{
                path:"instructor",
                select:"name"
              }
        })

        if (!exam) return res.status(404).json({ message: "Exam not found" });

        res.json(exam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Student submits exam answers
// controllers/examController.js

// const submitExam = async (req, res) => {
//     try {
//         const studentId = req.user.id;
//         const examId = req.params.id;
//         const { answers } = req.body;

//         // Check if the student already submitted this exam
//         const existingResult = await Result.findOne({ student: studentId, exam: examId });
//         if (existingResult) {
//             return res.status(400).json({
//                 success: false,
//                 message: "You have already submitted this exam.",
//                 result: existingResult,
//             });
//         }

//         // Fetch the exam and questions
//         const exam = await Exam.findById(examId).populate("questions");
//         if (!exam) {
//             return res.status(404).json({ success: false, message: "Exam not found" });
//         }

//         let score = 0;

//         for (const ans of answers) {
//             const question = exam.questions.find(
//                 (q) => q._id.toString() === ans.questionId
//             );
//             if (question && question.correctAnswer === ans.selectedOption) {
//                 score += 1;
//             }
//         }

//         const result = await Result.create({
//             student: studentId,
//             exam: exam._id,
//             course: exam.course,
//             answers,
//             score,
//         });

//         res.status(200).json({
//             success: true,
//             message: "Exam submitted successfully",
//             student: req.user.name,
//             score,
//             result,
//         });

//     } catch (err) {
//         console.error("Submit error:", err);
//         res.status(500).json({ success: false, error: err.message });
//     }
// };
const submitExam = async (req, res) => {
    try {
        const studentId = req.user.id;
        const examId = req.params.id;
        const { answers } = req.body;

        // Check if exam exists
        const exam = await Exam.findById(examId).populate("questions");
        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        // Prevent resubmission
        const existingResult = await Result.findOne({ student: studentId, exam: examId });
        if (existingResult) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted this exam.",
            });
        }

        // Check if answers are provided
        if (!answers || answers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No answers provided.",
            });
        }

        // Calculate score
        let score = 0;
        for (const ans of answers) {
            const question = exam.questions.find(
                q => q._id.toString() === ans.questionId
            );
            if (question && question.correctAnswer === ans.selectedOption) {
                score += 20;
            }
        }

        // Save result
        const result = await Result.create({
            student: studentId,
            exam: exam._id,
            course: exam.course,
            answers,
            score,
        });

        res.status(200).json({
            success: true,
            message: "Exam submitted successfully",
            student: req.user.name,
            score,
            result,
        });
    } catch (err) {
        console.error("Submit error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};


// Get student results by student id
const getResultsByStudent = async (req, res) => {
    try {
        const studentId = req.params.id;

        const results = await Result.find({ student: studentId })
            .populate("exam", "title date")
            .populate("student", "name email")
            .populate("course", "name code");

        if (!results || results.length === 0) {
            return res.status(404).json({ success: false, message: "No results found for this student." });
        }

        res.status(200).json({
            success: true,
            message: "Results retrieved successfully.",
            data: results // <-- Add this line to include the results
        });
    } catch (error) {
        console.error("Error fetching student results:", error);
        res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
};



//Delete result by  Course  Id //
const ResultDelete = async (req, res) => {
  try {
    const resultId  = req.params.id;

    const deletedResult = await Result.findOneAndDelete({ result: resultId });

    if (!deletedResult) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    res.status(200).json({
      success: true,
      message: "Result deleted successfully",
      deletedResult, // Optional: remove or trim if not needed
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

 // Delete All results by course Id //

 const ResultDeleteByCourse = async (req, res) => {
    try {
      const studentId = req.params.id;
  
      const result = await Result.deleteMany({ student: studentId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: "No results found for this course." });
      }
  
      res.status(200).json({
        success: true,
        message: `${result.deletedCount} result(s) deleted for course.`,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
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
    getStudentExams,
    UpdateExam,
    RequestDelete,
    GetPendingExams,
    DeleteExam,
    ResultDeleteByCourse,
    examDetails,
    Details,  // filter instructor based on their sub
    getExams,
    getExamById,
    submitExam,
    getResultsByStudent,
    ResultDelete,
    getResultsByExam
}