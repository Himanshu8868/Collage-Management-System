const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, enrollYear, endYear, address, Department, HOD } = req.body;

        // check if the user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: "User with the provided email or phone number already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
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
            HOD,
          
        });

        // Find all admin users
        const admins = await User.find({ role: "admin" });
        const adminIds = admins.map(admin => admin._id);

        // create notification for all admins
        await Notification.create({
            userId: user._id, // Now use the created user's id
            receiverIds: adminIds,
            title: "New Faculty Registration",
            message: `New user "${user.name}" has registered with role "${user.role}".`,
            link: "/account-requests" // Update the link properly
        });

        res.status(201).json({ message: "User registered successfully", user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};




const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // If the user doesn't exist or password doesn't match
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if the user's status is Active, only then allow login
        if (user.status === "Inactive" && user.approvalStatus === "pending") {
            return res.status(403).json({ message: "Your account is pending approval by an admin" });
        }

        // If the user is approved, generate the JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Set the token as a cookie and respond
        res.cookie("token", token, { httpOnly: true, secure: true });
        res.json({ message: "Login successful", token, role: user.role, name: user.name, email: user.email, user });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = { registerUser, loginUser };
