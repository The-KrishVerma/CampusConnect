import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RegisterComplaint = () => {
  const { token, backendUrl } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Maintenance'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/complaint/submit`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ title: '', description: '', category: 'Maintenance' });
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
      <div className="container mx-auto px-4 py-12 flex justify-center min-h-[70vh]">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Register a Complaint</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="Brief title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Academic">Academic</option>
                <option value="Visitor Hostel">Visitor Hostel</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="Describe your issue..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-2"
            >
              Submit Complaint
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegisterComplaint;
