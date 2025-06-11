const express = require("express");
const { getUserProfile , UserProfile ,UserDelete ,UpdateUser , UserStatus , getStudents , getPendingFaculties , approveFaculty , rejectFacultyRequest} = require("../controllers/userController");
const { protect , isAdmin , isFaculty, isAdminOrFaculty} = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch logged-in user profile
router.get("/profile", protect, getUserProfile);

//Fech All users  Admin for all or Student for instructor //
    router.get("/users" , protect , isAdminOrFaculty , UserProfile   )

//Delete a user by Id //
   
 router.delete("/:id" , protect ,isAdmin, UserDelete)

 //update user by id

  router.put("/:id" , protect , isAdminOrFaculty , UpdateUser)

  // Handle User status ( active  -inactive) //
    router.put("/:id/status"  , isAdmin ,protect , UserStatus)

// get all students //
    router.get("/student-all" , protect , isAdmin , getStudents )

// faculty registeration pending  requests //
router.get("/pending-faculty" , protect , isAdmin , getPendingFaculties)

//Aprrove faculty registration requests //
router.put("/approve-faculty/:facultyId" , protect , isAdmin  , approveFaculty )

// Reject faculty registration request //
router.put("/reject-faculty/:facultyId" , protect , isAdmin , rejectFacultyRequest)

module.exports = router;
