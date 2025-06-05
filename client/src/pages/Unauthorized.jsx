import React from "react";
import { Link } from "react-router-dom";
import { FiLock } from "react-icons/fi";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-4">
      <FiLock size={80} className="text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">401 - Unauthorized</h1>
      <p className="text-gray-600 mb-6">
        You don't have permission to view this page.
      </p>
      <Link
        onClick={handleback}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
