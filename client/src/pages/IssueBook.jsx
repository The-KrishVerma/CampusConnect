import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const IssueBook = () => {
  const { token, backendUrl } = useAppContext();
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    bookTitle: '',
    bookCode: '',
    author: ''
  });

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/library/my-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) fetchRequests();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/library/request`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ bookTitle: '', bookCode: '', author: '' });
        fetchRequests();
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
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 min-h-[70vh]">
        <div className="w-full md:w-1/3 bg-white p-8 rounded-xl shadow-lg h-fit">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Request a Book</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
              <input
                type="text"
                name="bookTitle"
                value={formData.bookTitle}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="e.g. Introduction to Algorithms"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Book Code</label>
              <input
                type="text"
                name="bookCode"
                value={formData.bookCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="e.g. CS101-ALG"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="e.g. Thomas H. Cormen"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-2"
            >
              Submit Request
            </button>
          </form>
        </div>

        <div className="w-full md:w-2/3 bg-white p-8 rounded-xl shadow-lg h-fit">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">My Library Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 border-b text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-3">Book Title</th>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Issue Date</th>
                  <th className="px-6 py-3">Return By</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.bookTitle}</td>
                    <td className="px-6 py-4 font-mono text-xs">{item.bookCode}</td>
                    <td className="px-6 py-4">{item.author}</td>
                    <td className="px-6 py-4">{item.issueDate ? new Date(item.issueDate).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4">{item.expectedReturnDate ? new Date(item.expectedReturnDate).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium 
                        ${item.status === 'Issued' ? 'bg-blue-100 text-blue-800' : 
                          item.status === 'Returned' ? 'bg-green-100 text-green-800' : 
                          item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">No book requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default IssueBook;
