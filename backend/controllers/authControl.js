const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");
const Activity = require("../models/Activity");

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            course,
            role,
            phone,
            semester,
            enrollYear,
            endYear,
            address,
            rollNo,
            department,
            HOD
        } = req.body;

        // check if the user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: "User with the provided email or phone number already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // determine status and approvalStatus
        let status = "Inactive";
        let approvalStatus = "pending";

        if (role === "student") {
            status = "Active";
            approvalStatus = "approved";
        }

        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            course,
            role,
            phone,
            semester,
            enrollYear,
            endYear,
            address,
            department,
            HOD,
            status,
            approvalStatus
        });

        // Find all admin users
        const admins = await User.find({ role: "admin" });
        const adminIds = admins.map(admin => admin._id);

        // create notification for all admins
        await Notification.create({
            userId: user._id,
            receiverIds: adminIds,
            title: "New Faculty Registration",
            message: `New user "${user.name}" has registered with role "${user.role}".`,
            link: "/account-requests"
        });

        // create activity for the new user
        await Activity.create({
            user: user._id,
            action: `New ${user.role} has registered: ${user.name}.`,
            type: "user"
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

        if (user.status === "Inactive" && user.approvalStatus === "approved") {
            return res.status(403).json({ message: "Your account is Inactive " });
        }

        // If the user is approved, generate the JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Set the token as a cookie and respond
        res.cookie("token", token, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ message: "Login successful", token, role: user.role, name: user.name, email: user.email, user });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = { registerUser, loginUser };
