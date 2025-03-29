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
    const user = await User.find().select('-password');
    if (user) {
        res.status(200).json(user);  
    } else {
        res.status(404).json({ message: "Unable to Find user", success: false });
    }
};

 //delete a user //
   
    const UserDelete = async (req , res) => {
           const deleteId = req.params.id;
         const user = await User.findByIdAndDelete(deleteId)
                if(user){
                    res.json(user)
                }
                
    }

module.exports = { getUserProfile , 
    UserProfile ,
     UserDelete
 };
