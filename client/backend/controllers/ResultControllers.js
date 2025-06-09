const Exam = require('../models/Exam');
const Course = require('../models/Course');
const Result = require('../models/Result');
const User = require('../models/User');


// GET /api/results/my-results – Get logged-in student's results by student Id

const getMyResults = async (req, res) => { 
    const userId = req.user._id; // Get the logged-in user's ID from the request object
     const results = await Result.find({ student: userId })
     .populate("student", "name email")
     .populate("exam", "title")
     .populate("course", "name description")

        if(userId){
            res.status(200).json({success: true , message:"Result found SuccessFully for student" ,results});
        }
        else{
            res.status(404).json({success: false , message:"Result not found for student"})
        }
}

// GET /api/results/:courseId/my-results    // for student
const getMyResultsByCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        const results = await Result.find({ course: courseId })
            .populate("exam", "title date duration")  // Populate exam details
            .populate("student", "name email")       // Populate student details
            .populate("course", "name code")         // Populate course details
            .populate({
                path:"course",
                  populate:{
                    path:"instructor",
                    select:"name"
                  }
            })
    

        if (!results || results.length === 0) {
            return res.status(404).json({ success: false, message: "No results found for this student." });
        }

        res.status(200).json({
            success: true,
            message: "Results retrieved successfully.",
            data: results
        });
    } catch (error) {
        console.error("Error fetching student results:", error);
        res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
};



//  Admin/Faculty Result APIs:  ///
 
 const getAllResults = async (req, res) => {
    try {
        const results = await Result.find()
            .populate("exam", "title date duration")
            .populate("student", "name email")
            .populate("course", "name code instructor");

        if (!results || results.length === 0) {
            return res.status(404).json({ success: false, message: "No results found." });
        }

        res.status(200).json({
            success: true,
            message: "Results retrieved successfully.",
            data: results
        });
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
}


//  Update Result APIs:  ///


const updateResult = async (req, res) => {
  try {
    const { examId, studentId, score } = req.body;
    const facultyId = req.user._id; // assuming middleware sets req.user
 

    if (!examId || !studentId || score == null) {
      return res.status(400).json({ success: false, message: "Exam ID, Student ID and Score are required." });
    }

    // Step 1: Find the exam and populate the course + instructor
    const exam = await Exam.findById(examId).populate({
      path: "course",
      populate: {
        path: "instructor",
        select: "_id name",
      },
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found." });
    }

    // Check if user is admin or the instructor
        if (
          exam.course.instructor._id.toString() !== facultyId.toString() &&
          req.user.role !== "admin"
        ) {
          return res.status(403).json({
            success: false,
            message: "You are not authorized to update this result.",
          });
        }     


    // Step 3: Find the result by examId and studentId
    const result = await Result.findOne({ exam: examId, student: studentId });

    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found for this student and exam." });
    }

    // Step 4: Update the score
    result.score = score;
    const updatedResult = await result.save();

    // Step 5: Populate the response with related details
    await updatedResult.populate("exam", "title date duration");
    await updatedResult.populate("student", "name email");
    await updatedResult.populate({
      path: "exam",
      populate: { path: "course", select: "name code" },
    });

    res.status(200).json({
      success: true,
      message: "Result updated successfully.",
      data: updatedResult,
    });
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};


  //  result Route: GET /api/students/by-exam/:examId
  const getStudentsByExam = async (req, res) => {
    try {
      const { examId } = req.params;
  
      // Get all result entries for the exam
      const results = await Result.find({ exam: examId }).populate("student", "name email");
  
      // Extract only the students from those results
      const students = results.map((r) => r.student);
  
      res.status(200).json({ success: true, students });
    } catch (err) {
      console.error("Error fetching students by exam:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  const deleteResult = async (req, res) => {
    try {
      const { examId, studentId } = req.body;
      const facultyId = req.user.id; // logged-in user ID
  
      // 1. Check if required fields are present
      if (!examId || !studentId) {
        return res.status(400).json({ success: false, message: "Exam ID and Student ID are required." });
      }
  
      // 2. Find the exam and populate its course and instructor
      const exam = await Exam.findById(examId).populate({
        path: "course",
        select: "instructor",
      });
  
      if (!exam) {
        return res.status(404).json({ success: false, message: "Exam not found." });
      }
  
      // 3. Check if the user is the instructor of the exam or an admin
      if (
        exam.course.instructor.toString() !== facultyId.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this result.",
        });
      }
  
      // 4. Find and delete the result
      const deletedResult = await Result.findOneAndDelete({
        exam: examId,
        student: studentId,
      });
  
      if (!deletedResult) {
        return res.status(404).json({
          success: false,
          message: "Result not found for this student and exam.",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Result deleted successfully.",
        deletedResult
      });
  
    } catch (error) {
      console.error("Error deleting result:", error);
      res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
  };
  
module.exports = {
    getMyResults,
    getMyResultsByCourse,
    getAllResults,
    updateResult,
    getStudentsByExam,
    deleteResult
}