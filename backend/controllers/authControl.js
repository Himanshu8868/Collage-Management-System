const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, enrollYear, endYear, address, Department, HOD } = req.body;

        //  check if the user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: "User with the provided email or phone number already exists" });
        }

        //  Hash the password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        //  Create new user after checking for duplicates
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            enrollYear,
            endYear,
            address,
            Department,
            HOD
        });

        res.status(201).json({ message: "User registered successfully", user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, );  // { expiresIn: "1h" }

        res.cookie("token", token, { httpOnly: true, secure: true });
        res.json({ message: "Login successful", token, role: user.role  , name:user.name , email:user.email , user });

        //  console.log("User Data:", user);


    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser };
