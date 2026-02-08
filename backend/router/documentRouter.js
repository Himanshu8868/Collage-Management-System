const express = require("express");
const router = express.Router();

const upload = require("../uploads/uploadMiddleware");
const {
  uploadDocument,
  GetByCourseId,
  deleteDocument,
  downloadDocument,
  GetAllDocuments
} = require("../controllers/DocumentController");

const { protect, isAdminOrFaculty } = require("../middleware/authMiddleware");

// Upload document
router.post("/upload", protect, upload.single("file"), uploadDocument);

// Download document
router.get("/download/:documentId", protect, downloadDocument);

// Get all documents
router.get("/all", protect, GetAllDocuments);

// Get documents by courseId (⚠️ ALWAYS KEEP LAST)
router.get("/:courseId", protect, GetByCourseId);

// Delete document
router.delete("/delete/:documentId", protect, isAdminOrFaculty, deleteDocument);

module.exports = router;
