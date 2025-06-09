import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DeleteResult = () => {
  const [examId, setExamId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all exams on load
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/exams/all-exams`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setExams(data.Exams || []);
      } catch (err) {
        // console.error("Error fetching exams:", err);
        toast.error("Failed to load exams",err);
      }
    };
    fetchExams();
  }, []);

  // Fetch students when exam changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!examId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/result/by-exam/${examId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setStudents(data.students || []);
      } catch (err) {
        toast.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, [examId]);

  const handleDelete = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to delete this result?");
    if (!confirmed) return;
  
    if (!examId || !studentId) {
      toast.error("Please select both exam and student.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/result/delete-result`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ examId, studentId }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Result deleted successfully.");
        setStudentId("");
        setExamId("");
        setStudents([]);
      } else {
        toast.error(data.message || "Deletion failed.");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-red-600">Delete Student Result</h2>
        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Exam</label>
            <select
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Choose Exam --</option>
              {exams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {`${exam.title} (${exam.course?.code})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Select Student</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Choose Student --</option>
              {students.length === 0 ? (
                <option disabled>-- No Students Available --</option>
              ) : (
                students.map((stu) => (
                  <option key={stu._id} value={stu._id}>
                    {stu.name} ({stu.email})
                  </option>
                ))
              )}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            {loading ? "Deleting..." : "Delete Result"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteResult;
