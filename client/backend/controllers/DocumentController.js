const Document = require("../models/Document");
const Course = require("../models/Course");

const uploadDocument = async (req, res) => {
  try {
    const { title, description, type, courseId } = req.body;

    if (req.user.role !== "faculty" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only faculty or admin can upload documents" });
    
    }

          const course = await Course.findById(courseId);
          if (!course) {
            return res.status(404).json({ message: "Course not found" });
          }

        // Ensure the faculty is assigned to this course
        if (String(course.instructor) !== String(req.user.id)) {
          return res.status(403).json({ message: "Not authorized to upload documnents" });
      }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const newDoc = new Document({
      title,
      description,
      fileUrl: req.file.path,
      type,
      courseId,
      uploadedBy: req.user._id
    });

    await newDoc.save();

    

    res.status(201).json({ message: "Document uploaded successfully", document: newDoc });

  } catch (error) {
    console.error("Document Upload Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Get Document by course Id //
 
// const GetByCourseId = async (req, res) => { 
//   try {
//     const { courseId } = req.params;
    
//     const documents = await Document.find({ courseId }).populate("uploadedBy", "name email");

//     if (!documents || documents.length === 0) {
//       return res.status(404).json({ message: "No documents found for this course" });
//     }

//     res.status(200).json(documents);
//   } catch (error) {
//     console.error("Get Document Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// }
const GetByCourseId = async (req, res) => { 
  try {
    const { courseId } = req.params;
    const { type } = req.query;


    const query = { courseId };
    if (type) query.type = type;

    

    const documents = await Document.find(query).populate("uploadedBy", "name email");

    if (!documents || documents.length === 0) {
      return res.status(404).json({ message: "No documents found" });
    }

    res.status(200).json(documents);
  } catch (error) {
    console.error("Get Document Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Delete a doucumrnt //

const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Allow if uploader or admin
    if (String(document.uploadedBy) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this document" });
    }

    await document.deleteOne();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete Document Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Filter documents by type //



module.exports = { uploadDocument,
  GetByCourseId,
  deleteDocument ,
  GetByCourseId
};
