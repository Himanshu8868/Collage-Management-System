import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiClock, FiBook, FiCalendar, FiX, FiSave } from "react-icons/fi";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const EditExam = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentExam, setCurrentExam] = useState(null);
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/exams/exam-specific", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setExams(response.data.exams);
            } else {
                setExams([]);
            }
        } catch (err) {
            setError("Failed to load exams");
            toast.error("Failed to load exams");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (examId) => {
        if (window.confirm("Are you sure you want to send  delete  request for this exam?")) {
            try {
                const token = localStorage.getItem("token");
                // Send PUT request to request deletion
                const response = await axios.put(
                    `http://localhost:5000/api/exams/${examId}/request-delete`, 
                    { examId },  // Send the examId as a payload
                    {
                        headers: { Authorization: `Bearer ${token}` }  // Authorization header with token
                    }
                );  
                     toast.success("Your request send successFully for Deleting ,")
                // Fetch the exams again
                     fetchExams();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to Create request for Deleting.';
                        toast.error(errorMessage)
                       
            }
        }
    };
    

    const openEditModal = (exam) => {
        setCurrentExam(exam);
        reset({
            title: exam.title,
            date: exam.date.split('T')[0],
            duration: exam.duration
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentExam(null);
    };

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem("token");
            const updatedExam = {
                ...currentExam,
                title: data.title,
                date: new Date(data.date).toISOString(),
                duration: Number(data.duration)
            };

            await axios.put(
                `http://localhost:5000/api/exams/${currentExam._id}`,
                updatedExam,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Exam updated successfully");
            fetchExams();
            closeEditModal();
        } catch (err) {
            toast.error("Failed to update exam");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-red-500 text-lg">{error}</p>
        </div>
    );

    return (
        <div className=" mt-14 container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FiBook className="mr-2" /> Exam Management
                    </h1>
                    <p className="text-gray-600">{exams.length} exams found</p>
                </div>

                {exams.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No exams found for your courses.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <FiCalendar className="inline mr-1" /> Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <FiClock className="inline mr-1" /> Duration
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {exams.map((exam) => (
                                    <tr key={exam._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{exam.course?.name || "N/A"}</div>
                                            <div className="text-sm text-gray-500">{exam.course?.code || ""}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {exam.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(exam.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                {exam.duration || "N/A"} mins
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => openEditModal(exam)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                <FiEdit className="inline mr-1" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exam._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FiTrash2 className="inline mr-1" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Exam Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Edit Exam</h2>
                            <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
                                <FiX size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                    Exam Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    {...register("title", { required: "Title is required" })}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.title ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs italic">{errors.title.message}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                                    Exam Date
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    {...register("date", { required: "Date is required" })}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.date ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.date && (
                                    <p className="text-red-500 text-xs italic">{errors.date.message}</p>
                                )}
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                                    Duration (minutes)
                                </label>
                                <input
                                    id="duration"
                                    type="number"
                                    min="1"
                                    {...register("duration", { 
                                        required: "Duration is required",
                                        min: {
                                            value: 1,
                                            message: "Duration must be at least 1 minute"
                                        }
                                    })}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors.duration ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.duration && (
                                    <p className="text-red-500 text-xs italic">{errors.duration.message}</p>
                                )}
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                >
                                    <FiSave className="mr-2" /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditExam;