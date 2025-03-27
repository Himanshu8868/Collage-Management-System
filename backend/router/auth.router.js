const express = require("express");
const { body } = require("express-validator"); // Import express-validator
const { registerUser, loginUser, getUserProfile, updateUser, deleteUser } = require("../controllers/authControl");
const router = express.Router();

// Register User Route (with validation)
router.post(
    "/register",
    [
        body("name", "Name must be at least 3 characters").isLength({ min: 3 }),
        body("email", "Enter a valid email").isEmail(),
        body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
        body("phone", "Phone number must be 10 digits").isLength({ min: 10, max: 10 }),
        body("role", "Role must be student, faculty, or admin").isIn(["student", "faculty", "admin"]),
    ],
    registerUser
);

  //login route
router.post("/login", loginUser);


module.exports = router;
