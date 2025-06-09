import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AttendanceProgress = () => {
  const [courseData, setCourseData] = useState([]);
  const [overallData, setOverallData] = useState(null);
  const [viewMode, setViewMode] = useState('semester'); // 'month' or 'semester'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const getStudentIdFromToken = (token) => {
    try {
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload.id || payload._id;
    } catch (err) {
      console.error("JWT decode error:", err);
      return null;
    }
  };

  const studentId = getStudentIdFromToken(token);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!studentId) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [courseRes, overallRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/attendance/summary/student/${studentId}?view=${viewMode}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/attendance/overall-attendance/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        if (courseRes.data.success && courseRes.data.data) {
          setCourseData(courseRes.data.data);
        }

        if (overallRes.data.success && overallRes.data.data) {
          const { totalDays, presentDays, absentDays } = overallRes.data.data;
          setOverallData([
            { name: 'Present', value: presentDays },
            { name: 'Absent', value: absentDays },
            { name: 'Remaining', value: totalDays - presentDays - absentDays }
          ]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [studentId, token, viewMode]);

  const getProgressBarColor = (percentage) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const exportCSV = () => {
    const csvData = courseData.map(item => ({
      Course: item.course,
      'Present Days': item.presentDays,
      'Total Days': item.totalDays,
      '%': item.percentage,
      'Class Avg': item.classAverage,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Attendance_${viewMode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Attendance Report (${viewMode})`, 14, 10);
    const rows = courseData.map(item => [
      item.course,
      item.presentDays,
      item.totalDays,
      `${item.percentage}%`,
      `${item.classAverage}%`
    ]);
    autoTable(doc, {
      head: [['Course', 'Present', 'Total', 'Your %', 'Class Avg %']],
      body: rows,
      startY: 20,
    });
    doc.save(`Attendance_${viewMode}.pdf`);
  };

  return (
    <div className="mt-19 mb-4 max-w-6xl mx-auto mt-10 p-6 shadow-md bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attendance Overview</h2>
        <div className="flex items-center space-x-4">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded"
          >
            <option value="semester">Semester View</option>
            <option value="month">Monthly View</option>
          </select>
          <button onClick={exportCSV} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Export CSV
          </button>
          <button onClick={exportPDF} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
            Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2 text-center">Overall Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={overallData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {overallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Course Progress Bars */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-center">Course-wise Attendance</h3>
            {courseData.length ? (
              <div className="space-y-6">
                {courseData.map((course, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span>{course.course}</span>
                      <span>{course.percentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                      <div
                        className={`h-3 ${getProgressBarColor(course.percentage)} rounded-full`}
                        style={{ width: `${course.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 flex justify-between mt-1">
                      <span>{course.presentDays} of {course.totalDays} present</span>
                      <span>Class Avg: {course.classAverage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No course attendance data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceProgress;
