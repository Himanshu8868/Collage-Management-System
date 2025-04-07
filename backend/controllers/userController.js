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

//Get all users Profile with roles //

const UserProfile = async (req, res) => {
    try {
        let query = {};

      
        if (req.user.role === "faculty") {
            query = { role: "student" };
        }
        else if(req.user.role === "admin"){
            query = {} //admin can see all users 
        }
        else {
        return res.status(403).json({ message: "Access Denied" });
        }

        const users = await User.find(query).select("-password");

        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            res.status(404).json({ message: " User not found", success: false });
        }
    } catch (error) {
        res.status(500).json({ message: "server error", error });
    }
};


//delete a user //

const UserDelete = async (req, res) => {
    const deleteId = req.params.id;
    const user = await User.findByIdAndDelete(deleteId)
    if (user) {
        res.json(user)
    }

}
//update user profile //

const UpdateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndUpdate(userId, req.body, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User updated", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Update user status (active/inactive)
const UserStatus =  async (req, res) => {
    try {
        const userId = req.params.id;
        const { status } = req.body;

        if (!['Active', 'Inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { status },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User status updated', user: updatedUser });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Server error' });
    }
}



module.exports = {
    getUserProfile,
    UserProfile,
    UserDelete,
    UpdateUser,
   UserStatus
};
