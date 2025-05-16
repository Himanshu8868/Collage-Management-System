import React, { useState } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';

const CreateNotice = () => {
    const token = localStorage.getItem('token')
  const [form, setForm] = useState({
    title: '',
    content: '',
    expiresInHours: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await axios.post('http://localhost:5000/api/notice/create', form , {
    
            headers: { Authorization: `Bearer ${token}` },
         
      });
       toast.success("Notice Created SuccessFully")
    } catch (err) {
    //   console.error(err);
     toast.error('Failed to create notice');
    }
  };

  return (
    <div className=" mt-19 mb-8 max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Notice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

       
        <input
          type="text"
          name="title"
          placeholder="Title"

          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="expiresInHours"
          placeholder="Expires In Hours"
          value={form.expiresInHours}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Notice
        </button>
      </form>
    </div>
  );
};

export default CreateNotice;
