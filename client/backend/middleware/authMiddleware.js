const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer") 
                    ? req.headers.authorization.split(" ")[1] 
                    : null);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized access - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied, Admins only" });
    }
};

const isFaculty = (req, res, next) => {
    if (req.user) {
        if (req.user.role === "faculty") {
            next();
        } else if (req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Access denied, Faculty only" });
        }
    } else {
        return res.status(401).json({ message: "Unauthorized access" });
    }
};

const isStudent = (req, res, next) => {
    if (req.user && req.user.role === "student") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied, Students only" });
    }
};

const isAdminOrFaculty = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "faculty")) {
        next();
    } else {
        return res.status(403).json({ message: "Access denied, Admins or Faculty only" });
    }
};

module.exports = { protect, isAdmin, isFaculty, isStudent ,isAdminOrFaculty };
