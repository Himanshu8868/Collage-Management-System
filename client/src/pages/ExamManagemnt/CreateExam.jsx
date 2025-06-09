import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useForm, useFieldArray } from 'react-hook-form';
import { FiPlus, FiTrash2, FiLoader, FiClock } from 'react-icons/fi';

const CreateExam = () => {
  const { register, handleSubmit, control, reset, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      code: '',
      title: '',
      date: '',
      startTime: '09:00',
      endTime: '10:00',
      duration: 60, // Duration in minutes (no conversion)
      questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
    },
  });
  
  const { fields, append, remove } = useFieldArray({ 
    control, 
    name: 'questions',
    rules: {
      required: "At least one question is required",
      minLength: {
        value: 1,
        message: "At least one question is required"
      }
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if(!token || role == "student"){
    window.location.href = "/home";
  }

  // Calculate duration when start or end time changes
  useEffect(() => {
    const startTime = watch('startTime');
    const endTime = watch('endTime');
    
    if (startTime && endTime) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      
      const startTotal = startHours * 60 + startMinutes;
      const endTotal = endHours * 60 + endMinutes;
      
      let duration = endTotal - startTotal;
      if (duration < 0) duration += 24 * 60; // Handle overnight
      
      setValue('duration', duration);
    }
  }, [watch('startTime'), watch('endTime'), setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setSubmissionError('');
    try {
      // Combine date and time
      const examDateTime = new Date(`${data.date}T${data.startTime}`);
      
      const examData = {
        ...data,
        date: examDateTime.toISOString(),
        // Duration remains in minutes (no conversion)
      };

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/exams`, examData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('Exam created successfully!')
      
      reset({
        code: '',
        title: '',
        date: '',
        startTime: '09:00',
        endTime: '10:00',
        duration: 60,
        questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
      });

    } catch (error) {
      console.error('Error creating exam:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create exam. Please try again.';
      setSubmissionError(errorMessage);
      toast.error(errorMessage)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-5 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create New Exam</h1>
          <p className="mt-2 text-gray-600">Fill in the details below to create a new exam</p>
        </div>

        {submissionError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700">{submissionError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Code and Title fields remain the same */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Course Code <span className="text-red-500">*</span>
              </label>
              <input
                id="code"
                {...register('code', { required: 'Course ID is required' })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., CS101"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Exam Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                {...register('title', { required: 'Exam title is required' })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., Midterm Exam"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Date and Time Picker */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Exam Date <span className="text-red-500">*</span>
              </label>
              <input
                id="date"
                type="date"
                {...register('date', { required: 'Exam date is required' })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Time <span className="text-red-500">*</span>
              </label>
              <button
                id="dropdownTimepickerButton"
                type="button"
                onClick={() => setShowTimePicker(!showTimePicker)}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between"
              >
                <span>Choose time</span>
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
              </button>

              {showTimePicker && (
                <div id="dropdownTimepicker" className="z-10 absolute mt-1 bg-white rounded-lg shadow-sm w-full dark:bg-gray-700 p-3 border border-gray-200">
                  <div className="max-w-[16rem] mx-auto grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <label htmlFor="start-time" className="block mb-2 text-sm font-medium text-gray-900">Start time:</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                          <FiClock className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                          type="time"
                          id="start-time"
                          {...register('startTime', { required: 'Start time is required' })}
                          className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          min="09:00"
                          max="18:00"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="end-time" className="block mb-2 text-sm font-medium text-gray-900">End time:</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                          <FiClock className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                          type="time"
                          id="end-time"
                          {...register('endTime', { required: 'End time is required' })}
                          className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          min="09:00"
                          max="18:00"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTimePicker(false)}
                    className="text-blue-700 text-sm hover:underline p-0"
                  >
                    Save time
                  </button>
                </div>
              )}
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
              )}
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
              )}
            </div>

            {/* Duration field (read-only, calculated from times) */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                id="duration"
                type="number"
                min="1"
                {...register('duration', { 
                  required: 'Duration is required',
                  min: {
                    value: 1,
                    message: 'Duration must be at least 1 minute'
                  }
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
                readOnly
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
              )}
            </div>
          </div>

          {/* Questions section remains the same */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Exam Questions</h3>
            <p className="text-sm text-gray-600 mb-4">Add all questions for this exam. Each question must have 4 options and a correct answer.</p>

            {fields.map((item, index) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Question {index + 1}</h4>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 flex items-center text-sm"
                    >
                      <FiTrash2 className="mr-1" /> Remove
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register(`questions.${index}.questionText`, { required: 'Question text is required' })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.questions?.[index]?.questionText ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter the question"
                  />
                  {errors.questions?.[index]?.questionText && (
                    <p className="mt-1 text-sm text-red-600">{errors.questions[index].questionText.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[0, 1, 2, 3].map((optIndex) => (
                      <div key={optIndex} className="flex items-center">
                        <span className="mr-2 text-gray-500">{String.fromCharCode(65 + optIndex)}.</span>
                        <input
                          {...register(`questions.${index}.options.${optIndex}`, { required: `Option ${String.fromCharCode(65 + optIndex)} is required` })}
                          className={`flex-1 px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.questions?.[index]?.options?.[optIndex] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                        />
                      </div>
                    ))}
                  </div>
                  {errors.questions?.[index]?.options && (
                    <p className="mt-1 text-sm text-red-600">All options are required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register(`questions.${index}.correctAnswer`, { required: 'Correct answer is required' })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.questions?.[index]?.correctAnswer ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select correct option</option>
                    <option value="0">Option A</option>
                    <option value="1">Option B</option>
                    <option value="2">Option C</option>
                    <option value="3">Option D</option>
                  </select>
                  {errors.questions?.[index]?.correctAnswer && (
                    <p className="mt-1 text-sm text-red-600">{errors.questions[index].correctAnswer.message}</p>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ questionText: '', options: ['', '', '', ''], correctAnswer: '' })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" /> Add Question
            </button>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => reset({
                code: '',
                title: '',
                date: '',
                startTime: '09:00',
                endTime: '10:00',
                duration: 60,
                questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
              })}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center justify-center min-w-32"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Exam'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExam;