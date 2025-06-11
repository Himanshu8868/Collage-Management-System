const express = require('express');
const router = express.Router();
const upload= require('../uploads/uploadMiddleware')
const { uploadDocument , GetByCourseId , deleteDocument} = require('../controllers/DocumentController');
const {protect , isAdminOrFaculty} = require('../middleware/authMiddleware')

// Middleware for file upload
router.post("/upload", protect, upload.single("file"), uploadDocument);

//Get document By Course Id //

router.get('/:courseId', protect, GetByCourseId);

// Delete a document //

router.delete('/delete/:documentId', protect, isAdminOrFaculty, deleteDocument);

module.exports = router;