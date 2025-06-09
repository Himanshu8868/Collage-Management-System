import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const InstructorAttendanceSummary = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/attendance/instructor/students/attendance-summary/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [courseId, token]);

  const fetchStudentStats = (studentId) => {
    const student = students.find(s => s.studentId === studentId);
    if (student) {
      setSelectedStudent(studentId);
      setStats({
        totalDays: student.total,
        presentDays: student.present,
        absentDays: student.absent,
        attendancePercentage: student.percentage
      });
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="mt-14 p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Course Attendance Summary</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Students</h2>
            <div className="space-y-3">
              {students.map((student) => (
                <div 
                  key={student.studentId} 
                  className={`p-3 rounded-lg hover:bg-gray-50 transition-colors ${selectedStudent === student.studentId ? 'bg-blue-50 border border-blue-200' : 'border border-gray-100'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-sm font-semibold ${getAttendanceColor(student.percentage)}`}>
                          {student.percentage}%
                        </span>
                        <span className="text-sm text-gray-500 mx-2">•</span>
                        {/* <span className="text-sm text-gray-500">
                          {student.present}/{student.total} classes
                        </span> */}
                      </div>
                    </div>
                    <button
                      onClick={() => fetchStudentStats(student.studentId)}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit sticky top-4">
            {selectedStudent && stats ? (
              <>
                <div className="flex justify-between items-center mb-4 pb-2 border-b">
                  <h2 className="text-xl font-semibold text-gray-700">Attendance Details</h2>
                  <button
                    onClick={() => {
                      setSelectedStudent(null);
                      setStats(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Total Classes</p>
                    <p className="text-xl font-bold text-blue-600">{stats.totalDays}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Present</p>
                    <p className="text-xl font-bold text-green-600">{stats.presentDays}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Absent</p>
                    <p className="text-xl font-bold text-red-600">{stats.absentDays}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${getAttendanceColor(stats.attendancePercentage)} bg-opacity-10`}>
                    <p className="text-sm text-gray-500">Attendance Percentage</p>
                    <p className="text-xl font-bold">{stats.attendancePercentage}%</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2">Select a student to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAttendanceSummary;
