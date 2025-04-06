import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiBook, FiCode, FiEdit2, FiUser, FiLoader } from "react-icons/fi";

const CreateCourse = () => {
  const token = localStorage.getItem("token");

  const [courseData, setCourseData] = useState({
    name: "",
    code: "",
    description: "",
    instructorId: ""
  });

  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingInstructors, setFetchingInstructors] = useState(true);
  const [errors, setErrors] = useState({
    name: "",
    code: "",
    description: "",
    instructorId: ""
  });

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses/instructors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (Array.isArray(data.Instructors)) {
          setInstructors(data.Instructors);
        } else {
          toast.warning("⚠️ No instructors found.");
          setInstructors([]);
        }
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
        toast.error("❌ Failed to fetch instructors.");
        setInstructors([]);
      } finally {
        setFetchingInstructors(false);
      }
    };

    fetchInstructors();
  }, [token]);

  const validateField = (name, value) => {
    let error = "";
    
    if (!value) {
      error = "This field is required";
    } else {
      switch (name) {
        case "code":
          if (!/^[A-Za-z]{2,4}\d{3}$/.test(value)) {
            error = "Course code should be in format like CS101";
          }
          break;
        case "name":
          if (value.length < 5) {
            error = "Course name should be at least 5 characters";
          }
          break;
        case "description":
          if (value.length < 20) {
            error = "Description should be at least 20 characters";
          }
          break;
        default:
          break;
      }
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate the field
    const error = validateField(name, value);
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    setCourseData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", courseData.name),
      code: validateField("code", courseData.code),
      description: validateField("description", courseData.description),
      instructorId: validateField("instructorId", courseData.instructorId)
    };
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/courses/create-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData)
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          throw new Error(data.message || "Validation failed");
        } else if (res.status === 404) {
          throw new Error("Instructor not found");
        } else if (res.status === 409) {
          throw new Error("Course code already exists");
        } else {
          throw new Error(data.message || "Failed to create course");
        }
      }

      if (data.success) {
        toast.success(data.message || "Course created successfully!");
        setCourseData({
          name: "",
          code: "",
          description: "",
          instructorId: ""
        });
      } else {
        throw new Error(data.message || "Course creation failed");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(error.message || "Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md mt-17">
      <div className="flex items-center mb-6">
        <FiBook className="text-indigo-600 text-3xl mr-3" />
        <h2 className="text-3xl font-bold text-gray-800 ">Create New Course</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FiEdit2 className="mr-2 text-indigo-500" />
            Course Name
          </label>
          <input
            type="text"
            name="name"
            value={courseData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Introduction to Computer Science"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FiCode className="mr-2 text-indigo-500" />
            Course Code
          </label>
          <input
            type="text"
            name="code"
            value={courseData.code}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.code ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="CS101"
          />
          {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
          <p className="mt-1 text-xs text-gray-500">Format: Subject code followed by number (e.g., CS101, MATH201)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FiEdit2 className="mr-2 text-indigo-500" />
            Description
          </label>
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Provide a detailed description of the course..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FiUser className="mr-2 text-indigo-500" />
            Instructor
          </label>
          {fetchingInstructors ? (
            <div className="flex items-center text-gray-500">
              <FiLoader className="animate-spin mr-2" />
              Loading instructors...
            </div>
          ) : (
            <>
              <select
                name="instructorId"
                value={courseData.instructorId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.instructorId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">-- Select Instructor --</option>
                {instructors.length > 0 ? (
                  instructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.name} ({instructor.email})
                    </option>
                  ))
                ) : (
                  <option disabled>No instructors available</option>
                )}
              </select>
              {errors.instructorId && <p className="mt-1 text-sm text-red-600">{errors.instructorId}</p>}
            </>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || fetchingInstructors}
            className={`w-full flex justify-center items-center px-6 py-3 rounded-lg text-white font-medium transition ${
              loading || fetchingInstructors
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Creating Course...
              </>
            ) : (
              "Create Course"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;