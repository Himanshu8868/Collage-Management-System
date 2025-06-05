import React, { useState } from "react";
import { parse } from "date-fns";

const CreateWeeklySchedule = () => {
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [entry, setEntry] = useState({
    day: "",
    startTime: "",
    endTime: "",
    subject: "",
    faculty: "",
    location: "",
  });
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState("");
  const [timeError, setTimeError] = useState("");

  const validateTimeFormat = (time) => {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
    return timeRegex.test(time);
  };

  const validateTimeOrder = (start, end) => {
    try {
      const formatTime = (timeStr) => parse(timeStr, "h:mm a", new Date());
      return formatTime(end) > formatTime(start);
    } catch {
      return false;
    }
  };

  const handleRemoveEntry = (index) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  const handleAddEntry = () => {
    if (!entry.day || !entry.startTime || !entry.endTime || !entry.subject || !entry.location) {
      alert("Please fill all required entry fields.");
      return;
    }

    if (!validateTimeFormat(entry.startTime) || !validateTimeFormat(entry.endTime)) {
      setTimeError("Time must be in format HH:MM AM/PM (e.g., 9:00 AM)");
      return;
    }

    if (!validateTimeOrder(entry.startTime, entry.endTime)) {
      setTimeError("End time must be after start time");
      return;
    }

    setTimeError("");
    setEntries([...entries, entry]);
    setEntry({
      day: "",
      startTime: "",
      endTime: "",
      subject: "",
      faculty: "",
      location: "",
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/weekly/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course, semester, entries }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Schedule created successfully!");
        setEntries([]);
        setCourse("");
        setSemester("");
      } else {
        setMessage(` Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(` Error: ${error.message}`);
    }
  };

  return (
<div className="max-w-6xl mx-auto mt-12 p-6 bg-white shadow-md rounded-xl">
  <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
    Create Weekly Schedule
  </h2>

  <div className="flex flex-col md:flex-row gap-6">
    {/* Left Side - Form */}
    <div className="md:w-1/2 space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="Course Name"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="uppercase input-field"
        />
        <input
          type="text"
          placeholder="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className=" uppercase input-field"
        />
      </div>

      <h3 className="text-xl font-medium text-gray-600">Add Entry</h3>
      <div className="grid grid-cols-1 gap-4">
        <select
          value={entry.day}
          onChange={(e) => setEntry({ ...entry, day: e.target.value })}
          className="input-field"
        >
          <option value="">Select Day</option>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
            <option key={day}>{day}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Start Time (e.g., 9:00 AM)"
          value={entry.startTime}
          onChange={(e) => setEntry({ ...entry, startTime: e.target.value })}
          className="uppercase input-field"
        />
        <input
          type="text"
          placeholder="End Time (e.g., 10:00 AM)"
          value={entry.endTime}
          onChange={(e) => setEntry({ ...entry, endTime: e.target.value })}
          className="uppercase input-field"
        />
        <input
          type="text"
          placeholder="Subject"
          value={entry.subject}
          onChange={(e) => setEntry({ ...entry, subject: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Faculty"
          value={entry.faculty}
          onChange={(e) => setEntry({ ...entry, faculty: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Location"
          value={entry.location}
          onChange={(e) => setEntry({ ...entry, location: e.target.value })}
          className="input-field"
        />
      </div>

      {timeError && <div className="text-red-600 font-medium text-sm mt-2">{timeError}</div>}

      <button
        onClick={handleAddEntry}
        className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Add Entry
      </button>

      <button
        onClick={handleSubmit}
        className="w-full px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Submit Schedule
      </button>

      {message && (
        <div className="p-3 text-center rounded-md bg-gray-100 text-gray-700">{message}</div>
      )}
    </div>

    {/* Right Side - Entries */}
    <div className="md:w-1/2">
      <h4 className="text-xl font-semibold mb-4 text-gray-800">Schedule Entries ({entries.length})</h4>
      <div className="space-y-4">
        {entries.map((e, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-2 md:mb-0">
                <p className="text-lg font-semibold text-blue-700">
                  <span className="text-green-700">Subject:</span> {e.subject}
                </p>
                <p className="text-sm text-gray-500">{e.day}</p>
              </div>
              <div className="text-sm text-gray-600 space-y-1 md:space-y-0 md:space-x-4 md:flex md:items-center">
                <span>🕒 {e.startTime} - {e.endTime}</span>
                <span>Room No: {e.location}</span>
                {e.faculty && <span>Faculty: {e.faculty}</span>}
                <button
                  onClick={() => handleRemoveEntry(i)}
                  className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  );
};

export default CreateWeeklySchedule;
