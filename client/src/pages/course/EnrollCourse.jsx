import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EnrollCourse = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password:"" ,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value  });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token')
        try {
            const response = await axios.post(`http://localhost:5000/api/courses/${id}/enroll`, formData, {

                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage(response.data.message);

        } catch (error) {
            setMessage("Failed to enroll. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enroll in Course</h2>
            {message && <p className="text-green-600">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
                    disabled={loading}
                >
                    {loading ? "Enrolling..." : "Enroll Now"}
                </button>
            </form>
        </div>
    );
};

export default EnrollCourse;
