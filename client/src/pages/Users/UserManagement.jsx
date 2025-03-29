import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiUserPlus } from "react-icons/fi";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/users/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    throw new Error("Invalid API response format");
                }
            } catch (err) {
                setError("Failed to load users. Please try again.");
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search and role
    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase()) ||
            user.role?.toLowerCase().includes(search.toLowerCase());
        
        const matchesRole = roleFilter ? user.role?.toLowerCase() === roleFilter.toLowerCase() : true;
        
        return matchesSearch && matchesRole;
    });

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // User actions
    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(users.filter(user => user._id !== userId));
                toast.success("User deleted successfully");
            } catch (err) {
                toast.error("Failed to delete user");
            }
        }
    };

    return (
        <div className=" mt-14 bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <button 
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        onClick={() => setShowModal(true)}
                    >
                        <FiUserPlus className="mr-2" />
                        Add User
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10 p-2 border rounded-lg dark:bg-gray-700 dark:text-white w-full"
                            />
                        </div>
                        
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiFilter className="text-gray-400" />
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10 p-2 border rounded-lg dark:bg-gray-700 dark:text-white w-full"
                            >
                                <option value="">All Roles</option>
                                <option value="Student">Student</option>
                                <option value="Faculty">Faculty</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-center mt-10">
                        <ClipLoader color="#3498db" size={50} />
                    </div>
                )}

                {/* Error Message */}
                {error && !loading && (
                    <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* User Table */}
                {!loading && !error && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-200 dark:bg-gray-700">
                                    <tr>
                                        <th className="py-3 px-4 text-left">Name</th>
                                        <th className="py-3 px-4 text-left">Email</th>
                                        <th className="py-3 px-4 text-left">Role</th>
                                        <th className="py-3 px-4 text-left">Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {currentUsers.length > 0 ? (
                                        currentUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                            <span className="text-gray-700 dark:text-gray-300">
                                                                {user.name?.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-gray-900 dark:text-white font-medium">
                                                                {user.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                                    {user.email}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        user.role === "Admin" ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200" :
                                                        user.role === "Faculty" ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" :
                                                        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        user.status === "Active" ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" :
                                                        "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                                                    }`}>
                                                        {user.status || "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded"
                                                        >
                                                            <FiEdit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user._id)}
                                                            className="text-red-600 hover:text-red-900 dark:hover:text-red-300 p-1 rounded"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-6 text-center text-gray-500">
                                                No users found matching your criteria
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredUsers.length > usersPerPage && (
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                                </div>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded border bg-white dark:bg-gray-600 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => paginate(i + 1)}
                                            className={`px-3 py-1 rounded border ${
                                                currentPage === i + 1 
                                                    ? "bg-blue-600 text-white" 
                                                    : "bg-white dark:bg-gray-600"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded border bg-white dark:bg-gray-600 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* User Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4 dark:text-white">
                                    {selectedUser ? "Edit User" : "Add New User"}
                                </h2>
                                
                                {/* Form would go here */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                            defaultValue={selectedUser?.name || ""}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                            defaultValue={selectedUser?.email || ""}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                        <select
                                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                            defaultValue={selectedUser?.role || "Student"}
                                        >
                                            <option value="Student">Student</option>
                                            <option value="Faculty">Faculty</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setSelectedUser(null);
                                        }}
                                        className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Handle save logic here
                                            setShowModal(false);
                                            setSelectedUser(null);
                                            toast.success(selectedUser ? "User updated successfully" : "User added successfully");
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;