const Exam = require('../models/Exam');
const Course = require('../models/Course');
const Result = require('../models/Result'); 
const User = require('../models/User');
// const { validationResult } = require('express-validator');

// Faculty creates an exam
const createExam = async (req, res) => {
    try {
        const { courseId, title, date, questions } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        // Ensure the faculty is assigned to this course
        if (String(course.instructor) !== String(req.user.id)) {
            return res.status(403).json({ message: "Not authorized to create exams for this course" });
        }

        const exam = await Exam.create({ course: courseId, title, date, questions })
          

        res.status(201).json({success : true , message:"Exam created successfully" , exam});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
 
   //Get all exam for a Course 
   
    const getExams = async (req, res) => {
        const courseId = req.params.courseId;
        try{
            const exam = await Exam.find({course: courseId}).populate("course", "name");
            res.status(200).json({success : true , exam});
            if(!exam){
                return res.status(404).json({message: "No exam found"});
            }
        }catch(error){
            res.status(400).json({error: error.message});
        }
    }

  //get all exms details //
       
       const examDetails = async (req , res) => {
               try{
                const Exams = await Exam.find()
                .populate("course", "name")
                  if(Exams){
                       res.status(200).json({success : true , Exams });
                  }
                  else{
                    return res.status(404).json({message: "No exam found"});
                  }
               }catch(error){
                res.status(500).json({error: error.message});
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
          if(results.length === 0){
            return res.status(404).json({message: " No result found for this student" });
        }
         res.status(200).json({success : true , message: "result found " , results});
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
    examDetails,
    getExams,
    getExamById,
    submitExam,
    getResultsByStudent,
    getResultsByExam
}