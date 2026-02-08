const Document = require("../models/Document");
const Course = require("../models/Course");
const fs = require("fs");
const path = require("path");

// ================= UPLOAD DOCUMENT =================
const uploadDocument = async (req, res) => {
  try {
    const { title, description, type, courseId } = req.body;

    if (req.user.role !== "faculty" && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only faculty or admin can upload documents"
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (String(course.instructor) !== String(req.user._id)) {
      return res.status(403).json({
        message: "Not authorized to upload documents for this course"
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const newDoc = new Document({
      title,
      description,
      type,
      courseId,
      uploadedBy: req.user._id,
      // WINDOWS PATH FIX
     fileUrl: req.file.path.replace(/\\/g, "/")

    });

    await newDoc.save();

    res.status(201).json({
      message: "Document uploaded successfully",
      document: newDoc
    });

  } catch (error) {
    console.error("Document Upload Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= DOWNLOAD DOCUMENT =================
// const downloadDocument = async (req, res) => {
//   try {
//     const { documentId } = req.params;

//     const document = await Document.findById(documentId);
//     if (!document) {
//       return res.status(404).json({ message: "Document not found" });
//     }

//     const filePath = path.join(__dirname, "..", document.fileUrl);

//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ message: "File not found on server" });
//     }

//     res.download(filePath);

//   } catch (error) {
//     console.error("Download Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

const downloadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const safePath = document.fileUrl.replace(/\\/g, "/");
    const filePath = path.join(__dirname, "..", safePath);

    console.log("Trying to download from:", filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ================= GET DOCUMENTS BY COURSE =================
const GetByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { type } = req.query;

    const query = { courseId };
    if (type) query.type = type;

    const documents = await Document
      .find(query)
      .populate("uploadedBy", "name email");

    if (!documents || documents.length === 0) {
      return res.status(404).json({ message: "No documents found" });
    }

    res.status(200).json(documents);

  } catch (error) {
    console.error("Get Document Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= DELETE DOCUMENT =================
const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (
      String(document.uploadedBy) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this document"
      });
    }

    await document.deleteOne();

    res.status(200).json({ message: "Document deleted successfully" });

  } catch (error) {
    console.error("Delete Document Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= GET ALL DOCUMENTS =================
const GetAllDocuments = async (req, res) => {
  try {
    const documents = await Document
      .find()
      .populate("uploadedBy", "name email");

    res.status(200).json(documents);

  } catch (error) {
    console.error("Get All Documents Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  uploadDocument,
  downloadDocument,
  GetByCourseId,
  deleteDocument,
  GetAllDocuments
};
