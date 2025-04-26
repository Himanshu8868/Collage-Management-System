const Course = require("../models/Course");
const User = require("../models/User");
const Notification = require("../models/Notification");

// validateCourseCode.js
function validateCourseCode(code) {
    const courseCodeRegex = /^[A-Z]{2,5}[0-9]{2,4}$/;
    return courseCodeRegex.test(code);
}


// Create a new course (Admin Only)
const createCourse = async (req, res) => {
    try {
        const { name, code, description } = req.body;

        // If role is faculty, set instructorId to the logged-in user's ID
        let instructorId = req.body.instructorId;
        if (req.user.role === "faculty") {
            instructorId = req.user._id; // Faculty gets their own ID automatically
        }

        if (!name || !code || !description || !instructorId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!validateCourseCode(code)) {
            return res.status(400).json({ message: "Invalid course code format. Example: CS101, MATH202." });
        }

        const instructor = await User.findById(instructorId);
        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }


        const existingCourse = await Course.findOne({ code });
        if (existingCourse) {
            return res.status(409).json({
                success: false,
                message: "Course with this code already exists"
            });
        }

        let status = "active";
        let approveRequest = false;
        let approvedByAdmin = false; // Default to false

        // Check if the user is admin or faculty
        if (req.user.role === "admin") {
            status = "active";
            approveRequest = false;
            approvedByAdmin = true; // Admin-created courses are automatically approved
        } else if (req.user.role === "faculty") {
            status = "pending";
            approveRequest = true;
        } else {
            return res.status(403).json({
                success: false,
                message: "Students cannot create courses"
            });
        }
        console.log(req.user.role)

        const course = await Course.create({
            name,
            code,
            description,
            instructor: instructorId,
            status,
            approveRequest,
            approvedByAdmin // Set for admin-created courses
        });

        // If it's a faculty, notify admins for approval
        if (req.user.role === "faculty") {
            const admins = await User.find({ role: "admin" });
            const adminIds = admins.map(admin => admin._id);

            await Notification.create({
                userId: req.user.id,
                receiverIds: adminIds,
                title: "Course Creation Request",
                message: `Instructor ${req.user.name} has requested to create the course "${course.name}".`,
                link: "/course-pending-requests"
            });
        }

        return res.status(201).json({
            success: true,
            message: req.user.role === "faculty" ? "Course submitted for approval" : "Course created successfully",
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





// admin can action course or view pending //
const getPendingCourseRequests = async (req, res) => {
    try {
        const pendingCourses = await Course.find({
            approveRequest: true,
            approvedByAdmin: { $ne: true }
        })
        .populate("instructor", "name email")
        .populate("studentsEnrolled", "name email");

        if (pendingCourses.length ===0 ) {
            return res.status(404).json({ message: "No pending course requests found." });
        }

        return res.status(200).json({
            success: true,
            pendingCourses
        });

    } catch (err) {
        // console.error("Fetch Pending Requests Error:", err);
        return res.status(500).json({ message: "Server Error", error: err.message });
    }
};


//  Requst aprrove couse //
const approveCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Course.findById(courseId).populate("instructor", "name email");
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.status !== "pending" || !course.approveRequest) {
            return res.status(400).json({ message: "This course does not need approval" });
        }

        course.status = "active";
        course.approvedByAdmin = true;
        await course.save();

        // Notify instructor
        await Notification.create({
            userId: req.user._id,
            receiverIds: [course.instructor._id],
            title: "Course Approved",
            message: `Your course "${course.name}" has been approved by ${req.user.name}.`
        });

        res.status(200).json({
            success: true,
            message: "Course approved successfully",
            course
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

//Reject course by ID (Admin Only)

const rejectCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Course.findById(courseId).populate("instructor", "name email");
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.status !== "pending" || !course.approveRequest) {
            return res.status(400).json({ message: "This course is not pending for approval" });
        }

        course.status = "rejected";
        course.approveByAdmin = false;
        await course.save();

        // Notify instructor
        await Notification.create({
            userId: req.user._id,
            receiverIds: [course.instructor._id],
            title: "Course Rejected",
            message: `Your course "${course.name}" has been rejected by ${req.user.name}.`
        });

        res.status(200).json({
            success: true,
            message: "Course rejected successfully",
            course
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
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
        const courses = await Course.find({ approvedByAdmin: true })
            .populate("instructor", "name email")
            .populate("studentsEnrolled", "name email");

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

// Get courses the logged-in student is enrolled in
const getEnrolledCourses = async (req, res) => {
    try {
      const studentId = req.user._id;
  
      const courses = await Course.find({
        studentsEnrolled: studentId
      }).populate("instructor", "name email");
  
      res.status(200).json({ success: true, data: courses });
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };

  //Faculty get all courses they are teaching
  const getMyCourses = async (req, res) => {
    try {
      const instructorId = req.user._id;  
      const courses = await Course.find({ instructor: instructorId })
        .populate("studentsEnrolled", "name email");
  
      if (courses.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No courses found for this instructor",
        });
      }
  
      res.status(200).json({ success: true, data: courses });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch your courses",
        error: error.message,
      });
    }
  };
  
  
  
  

module.exports = {
    createCourse,
    getPendingCourseRequests,
    approveCourseById,
    rejectCourseById,
    getCourses,
    GetInstructors, // Get all Instructors
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    getEnrolledCourses,
    getMyCourses // Faculty get all courses they are teaching
};
