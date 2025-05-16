import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const MyFeeDetails = () => {
  const [feeDetails, setFeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyFeeDetails = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/fee/my-fee', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch fee details');
        toast.error(data.error || 'Failed to fetch fee details');
      } else {
        setFeeDetails(data);
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      toast.error('Something went wrong. Please try again later.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyFeeDetails();
  }, []);

  return (
    <div className=" mt-17 mb-5 max-w-3xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">My Fee Details</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading fee details...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : feeDetails ? (
        <div className="bg-white p-6 rounded-md border border-gray-200">
          <p><span className="font-semibold">Name:</span> {feeDetails.student}</p>
          <p><span className="font-semibold">Email:</span> {feeDetails.email}</p>
          <p><span className="font-semibold">Deartment:</span> {feeDetails.course}</p>
          <p><span className="font-semibold">Year:</span> {feeDetails.year}</p>
          <p><span className="font-semibold">Semester:</span> {feeDetails.semester}</p>
          <p><span className="font-semibold">Total Fee:</span> ₹{feeDetails.totalFee}</p>
          <p><span className="font-semibold">Amount Paid:</span> ₹{feeDetails.amountPaid}</p>
          <p><span className="font-semibold">Remaining:</span> ₹{feeDetails.remaining}</p>
          <p><span className="font-semibold">Status:</span> 
            <span className={`ml-1 font-bold ${feeDetails.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
              {feeDetails.status}
            </span>
          </p>
<div className="flex justify-center items-center  bg-gray-100">
        <button
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg border-2 border-green-700 hover:bg-green-600 hover:shadow-lg transition duration-300"
            onClick={() => window.history.back()} 
        >
            Back
        </button>
  </div>

        </div>
      ) : (

        <div>
        <p className="text-center text-gray-500">No fee details found.</p>
        <div className="flex justify-center items-center  bg-gray-100">
        <button
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg border-2 border-green-700 hover:bg-green-600 hover:shadow-lg transition duration-300"
            onClick={() => window.history.back()} 
        >
            Back
        </button>
  </div>
 </div>
      )}
    </div>
  );
};

export default MyFeeDetails;
