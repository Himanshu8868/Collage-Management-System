const express = require("express");
const { getUserProfile , UserProfile ,UserDelete } = require("../controllers/userController");
const { protect , isAdmin , isFaculty} = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch logged-in user profile
router.get("/profile", protect, getUserProfile);

//Fech All users  Admin for all //
    router.get("/users" , protect  , UserProfile)

//Delete a user by Id //
   
 router.delete("/:id" , protect , UserDelete)

module.exports = router;
