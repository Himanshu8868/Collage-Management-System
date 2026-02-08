import React, { useState, useEffect } from "react";
import axios from "axios";

const DocumentViewer = () => {
  const [documents, setDocuments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [docType, setDocType] = useState("assignment");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ================= FETCH COURSES =================
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/courses/enrolled`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.data);
      } catch (error) {
        console.error(error);
        setMessage("Error fetching courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  // ================= FETCH DOCUMENTS =================
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!selectedCourse || !docType) return;

      setIsLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/documents/${selectedCourse}?type=${docType}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDocuments(res.data);
        setMessage("");
      } catch (error) {
        console.error(error);
        setDocuments([]);
        setMessage("No documents found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [selectedCourse, docType, token]);

  // ================= DOWNLOAD DOCUMENT =================
  const handleDownload = async (documentId, title) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/documents/download/${documentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", title || "document");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download error:", error);
      setMessage("Error downloading document");
    }
  };

  return (
    <div className="mt-14 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Course Documents</h2>
          <p className="text-indigo-100">View & download course materials</p>
        </div>

        <div className="p-6">
          {/* Message */}
          {message && (
            <div className="mb-4 p-3 rounded bg-blue-50 text-blue-700">
              {message}
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <select
              className="p-2 border rounded"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">-- Select Course --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="assignment">Assignment</option>
              <option value="notes">Notes</option>
              <option value="syllabus">Syllabus</option>
            </select>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="text-center py-10">Loading...</div>
          ) : documents.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No documents available
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="border rounded p-4 flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{doc.title}</h3>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded by: {doc.uploadedBy?.name}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(doc._id, doc.title)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
