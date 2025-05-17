import React, { useEffect, useState } from 'react';

const WeeklySchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState({});
  localStorage.getItem('course');
  localStorage.getItem('semester');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `http://localhost:5000/api/weekly`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setSchedule(data.schedule.entries);
          setCourseInfo({
            course: data.schedule.course,
            semester: data.schedule.semester,
          });
        }
      } catch (err) {
        console.error('Error fetching schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getEntriesForDay = (day) => {
    return schedule
      .filter((entry) => entry.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className=" mt-16 p-3 md:p-4 font-sans bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl md:text-2xl font-bold text-indigo-800">📅 Weekly Schedule</h1>
          <div className="text-xs md:text-sm bg-white px-3 py-1 rounded-full shadow-sm">
            <span className="text-gray-600">Course: </span>
            <span className="font-semibold text-indigo-700">{courseInfo.course}</span>
            <span className="mx-2">|</span>
            <span className="text-gray-600">Semester: </span>
            <span className="font-semibold text-indigo-700">{courseInfo.semester}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="p-2 text-left w-24">Day</th>
                    <th className="p-2 text-left">Time</th>
                    <th className="p-2 text-left">Subject</th>
                    <th className="p-2 text-left">Faculty</th>
                    <th className="p-2 text-left">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => {
                    const entries = getEntriesForDay(day);
                    return entries.length > 0 ? (
                      entries.map((entry, index) => (
                        <tr 
                          key={`${day}-${index}`} 
                          className={`hover:bg-indigo-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                        >
                          {index === 0 && (
                            <td
                              rowSpan={entries.length}
                              className="p-2 border-r border-gray-200 font-medium text-indigo-700 align-top"
                            >
                              {day}
                            </td>
                          )}
                          <td className="p-2 whitespace-nowrap">
                            {entry.startTime} - {entry.endTime}
                          </td>
                          <td className="p-2 font-medium text-gray-800">{entry.subject}</td>
                          <td className="p-2 text-gray-600">{entry.faculty || '-'}</td>
                          <td className="p-2 text-gray-600">{entry.location || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr key={day} className="hover:bg-indigo-50 bg-white">
                        <td className="p-2 border-r border-gray-200 font-medium text-indigo-700">{day}</td>
                        <td colSpan={4} className="p-2 text-gray-500 italic">
                          No classes
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-2">
              {days.map((day) => {
                const entries = getEntriesForDay(day);
                return (
                  <div key={day} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-indigo-600 text-white p-2 font-medium">
                      {day}
                    </div>
                    <div className="divide-y divide-gray-100">
                      {entries.length > 0 ? (
                        entries.map((entry, index) => (
                          <div key={index} className="p-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-800">{entry.subject}</span>
                              <span className="text-indigo-600 whitespace-nowrap">
                                {entry.startTime} - {entry.endTime}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>{entry.faculty || 'No faculty'}</span>
                              <span>{entry.location || 'No location'}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500 italic">
                          No classes scheduled
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklySchedule;