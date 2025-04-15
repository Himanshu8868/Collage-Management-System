import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiBook, FiUser, FiAward, FiLoader, FiChevronDown, FiCheckCircle } from "react-icons/fi";

const UpdateResultByDetails = () => {
  const [formData, setFormData] = useState({
    examId: "",
    studentId: "",
    score: ""
  });
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [showScoreHelp, setShowScoreHelp] = useState(false);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if(role !== "admin" && role !== "faculty") {
    toast.error("Access Denied! You are not authorized to view this page.");
    return ;
  }

  // Fetch exams on load
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/exams/all-exams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setExams(data.Exams || []);
      } catch (error) {
        console.error("Error fetching exams:", error);
        toast.error("Failed to load exams");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [token]);

  // Fetch students related to selected exam
  useEffect(() => {
    const fetchStudents = async () => {
      if (!formData.examId) {
        setStudents([]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/result/by-exam/${formData.examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStudents(data.students || []);
      } catch (error) {
        toast.error(res.message.data || "Failed to load students");
        toast.error("Failed to load students");
      } finally {
    
        setLoading(false);
      }
    };

    fetchStudents();
  }, [formData.examId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.examId || !formData.studentId || !formData.score) {
      toast.error("All fields are required");
      return;
    }

    const scoreNum = Number(formData.score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      toast.error("Score must be between 0 and 100");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/result/update-by-details", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          examId: formData.examId, 
          studentId: formData.studentId, 
          score: scoreNum 
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(<div className="flex items-center"><FiCheckCircle className="mr-2" /> Result updated successfully!</div>);
        setFormData(prev => ({ ...prev, score: "" }));
      } else {
        toast.error(data.message || "Failed to update result");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const selectedExam = exams.find(exam => exam._id === formData.examId);
  const selectedStudent = students.find(student => student._id === formData.studentId);

  return (
    <div className=" mt-14 min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Update Exam Result</h2>
          <p className="text-gray-600">Modify student scores and performance records</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiBook className="mr-2 text-blue-500" />
              Select Exam
            </label>
            <div className="relative">
              <select
                name="examId"
                value={formData.examId}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="">-- Choose Exam --</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.title} ({exam.course?.name || "N/A"})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
            {selectedExam && (
              <div className="text-xs text-gray-500 mt-1 pl-2">
                Date: {new Date(selectedExam.date).toLocaleDateString()} | 
                Duration: {selectedExam.duration} mins
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiUser className="mr-2 text-purple-500" />
              Select Student
            </label>
            <div className="relative">
              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!formData.examId || loading}
              >
                {students.length === 0 ? (
                  <option value="">-- No Students Available --</option>
                ) : (
                  <>
                    <option value="">-- Choose Student --</option>
                    {students.map((stu) => (
                      <option key={stu._id} value={stu._id}>
                        {stu.name} ({stu.email})
                      </option>
                    ))}
                  </>
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
            {selectedStudent && (
              <div className="text-xs text-gray-500 mt-1 pl-2">
                ID: {selectedStudent.students || "N/A"}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiAward className="mr-2 text-green-500" />
                Score
              </label>
              <button 
                type="button" 
                className="text-xs text-blue-600 hover:text-blue-800"
                onClick={() => setShowScoreHelp(!showScoreHelp)}
              >
                {showScoreHelp ? "Hide help" : "Need help?"}
              </button>
            </div>
            <input
              type="number"
              name="score"
              value={formData.score}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter score (0-100)"
              min="0"
              max="100"
              disabled={loading}
            />
            {showScoreHelp && (
              <div className="text-xs text-gray-500 mt-1 p-2 bg-gray-50 rounded">
                Enter a score between 0 and 100. Passing score is typically 50 or higher.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !formData.examId || !formData.studentId || !formData.score}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center ${
              loading || !formData.examId || !formData.studentId || !formData.score
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Result"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Double-check all information before submitting changes.</p>
        </div>
      </div>
    </div>
  );
};

export default UpdateResultByDetails;