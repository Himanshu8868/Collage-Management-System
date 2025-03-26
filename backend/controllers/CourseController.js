const Course = require("../models/Course");
const User = require("../models/User");

// Create a new course (Admin Only)
const createCourse = async (req, res) => {
    try {
        const { name, code, description, instructorId } = req.body;

        const instructor = await User.findById(instructorId).populate("name");
        if (!instructor || instructor.role !== "faculty") {
            return res.status(400).json({ message: "Invalid instructor ID" });
        }

        const course = await Course.create({ name, code, description, instructor: instructorId });
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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
        const { name, code, description } = req.body;

        let course = await Course.findById(req.params.id)
        .populate("instructor", "name email" ) 
        .populate("studentsEnrolled", "name email");   ;
        if (!course) return res.status(404).json({ message: "Course not found" });
          else{ 
            res.json({message: "You are not authorized to update this course"})
        }
      
        course.name = name || course.name;
        course.code = code || course.code;
        course.description = description || course.description;

        course = await course.save();
        res.status(200).json({message:"Course Updated SuccessFully", course});

    } catch (error) {
        res.status(400).json({ error: error.message });
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
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollInCourse
};
