const Activity = require('../models/Activity');
const User = require('../models/User');

const CreateActivity =  async(req , res) => {
      
    try {
        const {user , action , type} =req.body;
        const activity = new Activity({
            user,
            action: action,
            type: type
        });
        await activity.save();

        res.status(201).json({
            success: true,
            message: "Activity Created Successfully",
            activity
        });

    }catch(error) {
        console.error("Error creating activity:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

// Get all activities for a user (Only Admin )

const AllActivities = async (req , res) => {

    const activities = await Activity.find({}).populate('user', 'name email').sort({ timestamp: -1 });
    if (!activities) {
        return res.status(404).json({
            success: false,
            message: "No activities found"
        });
    }
    res.status(200).json({
        success: true,
        activities
    });
}

const recentActivity = async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const activities = await Activity.find().populate('user', 'name email').sort({ timestamp: -1 }).limit(limit);
    res.json({ activities });
  };
  
  
module.exports = {
    CreateActivity,
   AllActivities,
   recentActivity
}