import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const AllExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/exams/all-exams`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // console.log("Fetched Exams:", res.data.Exams);
                setExams(res.data.Exams || []);
            } catch (err) {
                setError("Failed to load exams");
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    const filteredExams = exams.filter(
        (exam) =>
            exam.title?.toLowerCase().includes(search.toLowerCase()) ||
            exam.course?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <p className="text-center text-lg">Loading exams...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="flex h-screen py-10 bg-dark">
            <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 overflow-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">All Exams</h1>

                <input
                    type="text"
                    placeholder="Search by exam title or course..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 mb-6 border rounded-lg dark:bg-gray-800 dark:text-white"
                />

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                                <th className="py-2 px-4 border-b">Exam Code</th>
                                <th className="py-2 px-4 border-b">Exam Title</th>
                                <th className="py-2 px-4 border-b">Course</th>
                                <th className="py-2 px-4 border-b">Date</th>
                                <th className="py-2 px-4 border-b">Duration</th>
                                <th className="py-2 px-4 border-b">Instructor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExams.length > 0 ? (
                                filteredExams.map((exam) => (
                                    <tr key={exam._id} className="text-gray-700 dark:text-gray-300 p-5"  onClick={() => navigate(`/student-exam/${exam._id}`)}>
                                        <td className="py-2 px-4 border-b">{exam.course?.code || "N/A"}</td>
                                        <td className="py-2 px-4 border-b">{exam.title || "N/A"}</td>
                                        <td className="py-2 px-4 border-b">{exam.course?.name || "N/A"}</td>
                                        <td className="py-2 px-4 border-b">
                                            {exam.date ? new Date(exam.date).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {exam.duration
                                                ? `${Math.floor(exam.duration / 60000)} mins`
                                                : "N/A"}
                                        </td>
                                        <td className="py-2 px-4 border-b">{exam.course?.instructor?.name || "Na"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-gray-500">
                                        No exams found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllExams;
