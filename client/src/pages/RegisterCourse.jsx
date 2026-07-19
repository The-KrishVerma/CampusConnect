import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RegisterCourse = () => {
  const { token, backendUrl } = useAppContext();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);

  const fetchData = async () => {
    try {
      const [availRes, myRes] = await Promise.all([
        axios.get(`${backendUrl}/api/course/available`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${backendUrl}/api/course/my-courses`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (availRes.data.success) setAvailableCourses(availRes.data.courses);
      if (myRes.data.success) setMyCourses(myRes.data.registrations);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleRegister = async (courseId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/course/register`, { courseId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDrop = async (registrationId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/course/drop`, { registrationId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8 min-h-[70vh]">
        
        {/* Available Courses */}
        <div className="w-full lg:w-1/2 bg-white p-8 rounded-xl shadow-lg h-fit">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Courses</h2>
          <div className="space-y-4">
            {availableCourses.map((course) => {
              const isRegistered = myCourses.some(reg => reg.course._id === course._id && reg.status === 'Registered');
              const isFull = course.enrolledCount >= course.capacity;

              return (
                <div key={course._id} className="border p-4 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-bold text-lg">{course.code} - {course.title}</h3>
                    <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                    <p className="text-sm text-gray-500 mt-1">Credits: {course.credits} | Capacity: {course.enrolledCount}/{course.capacity}</p>
                  </div>
                  <div>
                    {isRegistered ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Registered</span>
                    ) : isFull ? (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Full</span>
                    ) : course.isFrozen ? (
                        <button disabled className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">
                          Frozen
                        </button>
                      ) : (
                        <button 
                          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                          onClick={() => handleRegister(course._id)}
                        >
                          Register
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
            {availableCourses.length === 0 && (
              <p className="text-gray-500 text-center py-4">No courses available for registration right now.</p>
            )}
          </div>
        </div>

        {/* My Registered Courses */}
        <div className="w-full lg:w-1/2 bg-white p-8 rounded-xl shadow-lg h-fit">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">My Schedule</h2>
          <div className="space-y-4">
            {myCourses.map((reg) => (
              <div key={reg._id} className="border border-green-200 bg-green-50 p-4 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow">
                <div>
                  <h3 className="font-bold text-lg text-green-900">
                    {reg.course?.code} - {reg.course?.title}
                    {reg.course?.isFrozen && <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Frozen</span>}
                  </h3>
                  <p className="text-sm text-green-700">Instructor: {reg.course?.instructor}</p>
                  <p className="text-sm text-green-600 mt-1">Credits: {reg.course?.credits} | Semester: {reg.semester}</p>
                </div>
                <div>
                  {reg.course?.isFrozen ? (
                    <button disabled className="text-gray-400 text-sm cursor-not-allowed">
                      Action Frozen
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleDrop(reg._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Drop Course
                    </button>
                  )}
                </div>
              </div>
            ))}
            {myCourses.length === 0 && (
              <p className="text-gray-500 text-center py-4">You have not registered for any courses yet.</p>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default RegisterCourse;
