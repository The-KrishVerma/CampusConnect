import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const ManageLibrary = () => {
  const { backendUrl, token } = useAppContext();
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/library/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setRequests(response.data.requests);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      // By default setting return date to 14 days from issue date
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14);

      const response = await axios.post(`${backendUrl}/api/library/admin/update-status`, { 
        id, 
        status, 
        expectedReturnDate: status === 'Issued' ? returnDate : undefined 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchRequests();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className='flex-1 p-4 md:p-10 text-white'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4'>
        <h1 className='text-2xl font-semibold'>Manage Library Requests</h1>
      </div>
      <div className='relative overflow-x-auto bg-gray-800 shadow-lg rounded-lg border border-gray-700'>
        <table className='w-full text-sm text-left text-gray-400'>
          <thead className='text-xs text-gray-400 uppercase bg-gray-800 border-b-2 border-gray-700'>
            <tr>
              <th className="px-6 py-3">Student</th>
              <th className="px-6 py-3">Book Title</th>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Author</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((item, index) => (
              <tr key={index} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-6 py-4">{item.user?.name || 'Unknown'}</td>
                <td className="px-6 py-4 font-medium text-white">{item.bookTitle}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-400">{item.bookCode}</td>
                <td className="px-6 py-4">{item.author}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium 
                    ${item.status === 'Issued' ? 'bg-blue-100 text-blue-800' : 
                      item.status === 'Returned' ? 'bg-green-100 text-green-800' : 
                      item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex flex-wrap gap-2">
                  {item.status === 'Requested' && (
                    <>
                      <button onClick={() => updateStatus(item._id, 'Issued')} className="text-white bg-blue-500 px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors">Issue</button>
                      <button onClick={() => updateStatus(item._id, 'Rejected')} className="text-white bg-red-500 px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors">Reject</button>
                    </>
                  )}
                  {item.status === 'Issued' && (
                    <button onClick={() => updateStatus(item._id, 'Returned')} className="text-white bg-green-500 px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors">Mark Returned</button>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">No library requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLibrary;
