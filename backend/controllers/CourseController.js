const Course = require("../models/Course");
const User = require("../models/User");

// Create a new course (Admin Only)
const createCourse = async (req, res) => {
    try {
        const { name, code, description, instructorId } = req.body;

        // Validate required fields
        if (!name || !code || !description || !instructorId) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        // Check if instructor exists and is faculty
        const instructor = await User.findById(instructorId);
        if (!instructor) {
            return res.status(404).json({ 
                success: false,
                message: "Instructor not found" 
            });
        }
        if (instructor.role !== "faculty") {
            return res.status(400).json({ 
                success: false,
                message: "Selected user is not a faculty member" 
            });
        }

        // Check if course code already exists
        const existingCourse = await Course.findOne({ code });
        if (existingCourse) {
            return res.status(409).json({ 
                success: false,
                message: "Course with this code already exists" 
            });
        }

        // Create course
        const course = await Course.create({ 
            name, 
            code, 
            description, 
            instructor: instructorId 
        });

        if (!course) {
            return res.status(400).json({ 
                success: false,
                message: "Failed to create course" 
            });
        }

        res.status(201).json({ 
            success: true,
            message: "Course created successfully",
            course 
        });

    } catch (error) {
        console.error("Course creation error:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }
};
   
// Get all Instructors//

      const GetInstructors = async(req , res) => {
            try{
         const Instructors = await User.find({role:"faculty"})
           if(Instructors.length > 0) {
              res.status(200).json({message:"Instructors Found " , success:true ,Instructors});
            } else{
                    res.status(404).json({success:false , message: "Instructors Not found"})
                }
           }catch(error){
              res.status(500).json({message:"Server Error" , success:false , error:error.message})
           }
        }
      

// Get all courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("instructor", "name email").populate("studentsEnrolled", "name email");  
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get course by ID
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        .populate("instructor", "name email" ) 
        .populate("studentsEnrolled", "name email");   
        if (!course) return res.status(404).json({ message: "Course not found" });

        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

 
// Update course details (Faculty or Admin)
const updateCourse = async (req, res) => {
    try {
        const { name, code, description, instructor } = req.body;
        const courseId = req.params.id;
        const userId = req.user._id;

        // Find the course and populate related data
        let course = await Course.findById(courseId)
            .populate("instructor", "name email")
            .populate("studentsEnrolled", "name email");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if the requesting user is the course instructor or admin
        if (course.instructor._id.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "You are not authorized to update this course" });
        }

        // Update course fields
        course.name = name || course.name;
        course.code = code || course.code;
        course.description = description || course.description;
        
        // Update instructor if provided
        if (instructor) {
            course.instructor = instructor;
        }

        // Save the updated course
        const updatedCourse = await course.save();

        // Respond with the updated course data
        res.status(200).json({
            message: "Course updated successfully",
            course: updatedCourse
        });

    } catch (error) {
        console.error("Error updating course:", error);
        res.status(400).json({ 
            error: error.message || "Failed to update course" 
        });
    }
};
// Delete a course (Admin Only)
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        .populate("instructor", "name email" ) 
        .populate("studentsEnrolled", "name email");   ;
        if (!course) return res.status(404).json({ message: "Course not found" });

        await course.deleteOne();
        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Enroll student in a course
const enrollInCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });

        if (course.studentsEnrolled.includes(req.user.id)) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        course.studentsEnrolled.push(req.user.id);
        await course.save();

        res.json({ message: "Successfully enrolled in the course" , course });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    createCourse,
    getCourses,
    GetInstructors, // Get all Instructors
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollInCourse
};
