const User = require("../models/User");

// Get logged-in user profile
// const getUserProfile = async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id).select("-password"); // Exclude password
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User Data:", user);
        res.json(user);
    } catch (error) {
        console.error("Error fetching profile:", error); 
        res.status(500).json({ error: error.message });
    }
};


module.exports = { getUserProfile };
