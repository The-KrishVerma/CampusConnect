import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const ManageCourses = () => {
  const { backendUrl, token } = useAppContext();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    instructor: '',
    credits: '',
    capacity: ''
  });

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/course/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCourses(response.data.courses);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/course/admin/add`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ title: '', code: '', instructor: '', credits: '', capacity: '' });
        fetchCourses();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveCourse = async (id) => {
    if (!window.confirm("Are you sure you want to remove this course?")) return;
    const password = window.prompt("Enter admin password to confirm removal:");
    if (!password) return;
    try {
      const response = await axios.post(`${backendUrl}/api/course/admin/remove`, { id, password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCourses();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleFreeze = async (id) => {
    const password = window.prompt("Enter admin password to confirm this action:");
    if (!password) return;
    try {
      const response = await axios.post(`${backendUrl}/api/course/admin/toggle-freeze`, { id, password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCourses();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='flex-1 p-4 md:p-10 text-white'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4'>
        <h1 className='text-2xl font-semibold'>Manage Courses Catalog</h1>
      </div>

      {/* Add Course Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
        <h3 className="font-semibold text-lg mb-4 text-white">Add New Course</h3>
        <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Course Title" className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <input type="text" name="code" value={formData.code} onChange={handleChange} required placeholder="Course Code" className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <input type="text" name="instructor" value={formData.instructor} onChange={handleChange} required placeholder="Instructor" className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <input type="number" name="credits" value={formData.credits} onChange={handleChange} required min="1" placeholder="Credits" className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required min="1" placeholder="Capacity" className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:border-primary" />
          </div>
          <div className="lg:col-span-6">
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors w-full sm:w-auto">
              Add Course to Catalog
            </button>
          </div>
        </form>
      </div>

      {/* Course List */}
      <div className='relative overflow-x-auto bg-gray-800 shadow-lg rounded-lg border border-gray-700'>
        <table className='w-full text-sm text-left text-gray-400'>
          <thead className='text-xs text-gray-400 uppercase bg-gray-800 border-b-2 border-gray-700'>
            <tr>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Instructor</th>
              <th className="px-6 py-3">Credits</th>
              <th className="px-6 py-3">Enrolled/Capacity</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((item, index) => (
              <tr key={index} className={`bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 ${item.isFrozen ? 'opacity-80' : ''}`}>
                <td className="px-6 py-4 font-bold text-white">
                  {item.code} 
                  {item.isFrozen && <span className="ml-2 text-xs font-normal text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">Frozen</span>}
                </td>
                <td className="px-6 py-4 font-medium text-gray-300">{item.title}</td>
                <td className="px-6 py-4">{item.instructor}</td>
                <td className="px-6 py-4">{item.credits}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.enrolledCount >= item.capacity ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {item.enrolledCount} / {item.capacity}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                  <button onClick={() => handleToggleFreeze(item._id)} className={`text-white px-3 py-1 rounded text-xs transition-colors ${item.isFrozen ? 'bg-gray-600 hover:bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}>
                    {item.isFrozen ? 'Unfreeze' : 'Freeze'}
                  </button>
                  <button onClick={() => handleRemoveCourse(item._id)} className="text-white bg-red-500 px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">No courses in catalog.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCourses;
