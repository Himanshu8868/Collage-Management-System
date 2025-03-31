import React, { useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify"


const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        enrollYear: "",
        endYear: "",
        address: "",
        department: "",
        hod: "",
        role: "student"
    });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
   

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", formData);
                      if(response.success)
                toast.success("Registration successful! Redirecting to login...");
                      window.location.href = response.data.role === "student" ? "/studentDashboard" : "/dashboard";
        } catch (err) {
              if(err.response?.status == 400){
                setTimeout(() => {
                      toast.error("User Alreday exits , Try different Email or Number")
                }, 2000)
              } 
              else{
                toast.error(err.response?.data?.message || "Registration Failed");
              }
        }
    };

    return (
        <div className=" mt-15 max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Create Account</h2>
            
            {message && (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-6">
                    {message}
                </div>
            )}
            
            {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Column */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Personal Information</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name*</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email*</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password*</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            required
                            minLength="6"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number*</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            required
                            pattern="[0-9]{10}"
                            title="10 digit phone number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address*</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            required
                            rows="3"
                        />
                    </div>
                </div>

                {/* Academic Information Column */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Academic Information</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role*</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            required
                        >
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department*</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            required
                        >
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Business Administration">Business Administration</option>
                        </select>
                    </div>

                    {formData.role === "student" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enrollment Year*</label>
                                <input
                                    type="number"
                                    name="enrollYear"
                                    value={formData.enrollYear}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    min="2000"
                                    max={new Date().getFullYear()}
                                    required={formData.role === "student"}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Graduation Year*</label>
                                <input
                                    type="number"
                                    name="endYear"
                                    value={formData.endYear}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    min={formData.enrollYear || 2000}
                                    max={formData.enrollYear ? parseInt(formData.enrollYear) + 6 : 2030}
                                    required={formData.role === "student"}
                                />
                            </div>
                        </>
                    )}

                    {formData.role === "faculty" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HOD Name</label>
                            <input
                                type="text"
                                name="hod"
                                value={formData.hod}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                required={formData.role === "faculty"}
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button - Full Width */}
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
                    >
                        Register Account
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;