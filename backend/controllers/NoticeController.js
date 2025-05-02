const Notice = require('../models/Notice');
const User = require('../models/User');

// Create a new notice //

const createNotice = async (req, res) => {
      try {
      
      const { title, content, expiresInHours } = req.body;
      const userId = req.user._id; // Get the user ID from the request
      const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000); // e.g., 48 hours
      const notice = await Notice.create({
       createdBy: userId,
        expiresAt,
        title,
        content,
      });
      await notice.populate('createdBy', 'name email');
        res.status(201).json({
            success: true,
            message: 'Notice created successfully',
            notice,
            });
        }catch (error) {
            console.error('Error creating notice:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
}

// Get all notices for a user
   const getNotices = async (req , res) => {
     const  notice = await Notice.find().populate('createdBy', 'name email');
     if (!notice) {
         return res.status(404).json({
             success: false,
             message: 'No notices found',
         });
     }
        res.status(200).json({
            success: true,
            data: notice,
        }); 
   }

   // Delete expired notices automatically
    const deleteExpiredNotices = async () => {
     try {
          const currentDate = new Date();
          await Notice.deleteMany({ expiresAt: { $lt: currentDate } });
          
     } catch (error) {
         res.status(500).json({
             success: false,
             message: 'Internal server error',
         });    
     }
    }


    // Delete notice by id //

    const DeleteNotice = async (req, res) => {
         
        
          const notice = req.params.id;
          const noticeToDelete = await Notice.findByIdAndDelete(notice);
            if (!noticeToDelete) {
                return res.status(404).json({
                    success: false,
                    message: 'Notice not found',
                });
            }
            res.status(200).json({
                success: true,
                message: 'Notice deleted successfully',
            });

    }

module.exports = {
    createNotice,
    getNotices,
    deleteExpiredNotices,
    DeleteNotice
}