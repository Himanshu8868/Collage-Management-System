const express = require('express');
const router = express.Router()
const {createNotice,
   getNotices,
   deleteExpiredNotices,
   DeleteNotice
}  
=require('../controllers/NoticeController')

const {protect, isAdminOrFaculty, } = require('../middleware/authMiddleware')

//Create a new notice

router.post('/create', protect ,isAdminOrFaculty , createNotice);

//Get all notices for a user
router.get('/getNotices', protect , getNotices);

//Delete expired notices automatically
router.delete('/deleteExpiredNotices', protect , isAdminOrFaculty , deleteExpiredNotices);

//Delete notice by notice Id //
router.delete('/deleteNotice/:id', protect , isAdminOrFaculty , DeleteNotice );

module.exports = router ;