import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const ManageComplaints = () => {
  const { backendUrl, token } = useAppContext();
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All');

  const getButtonClass = (buttonFilter) => {
    return `border rounded-full px-4 py-1.5 cursor-pointer text-xs transition-all duration-200 ${
      filter === buttonFilter
        ? 'bg-primary text-white border-primary'
        : 'text-gray-300 border-gray-600 hover:bg-gray-700'
    }`;
  };

  const filteredComplaints = complaints.filter((item) => {
    if (filter === 'All') return true;
    if (filter === 'Resolved') return item.status === 'Resolved';
    if (filter === 'Pending') return item.status === 'Pending';
    return true;
  });

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/complaint/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setComplaints(response.data.complaints);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.post(`${backendUrl}/api/complaint/admin/update-status`, { id, status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchComplaints();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className='flex-1 p-4 md:p-10 text-white'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4'>
        <h1 className='text-2xl font-semibold'>Manage Complaints</h1>
        <div className='flex flex-wrap gap-3'>
          <button onClick={() => setFilter('All')} className={getButtonClass('All')}>All</button>
          <button onClick={() => setFilter('Resolved')} className={getButtonClass('Resolved')}>Resolved</button>
          <button onClick={() => setFilter('Pending')} className={getButtonClass('Pending')}>Pending</button>
        </div>
      </div>
      <div className='relative overflow-x-auto bg-gray-800 shadow-lg rounded-lg border border-gray-700'>
        <table className='w-full text-sm text-left text-gray-400'>
          <thead className='text-xs text-gray-400 uppercase bg-gray-800 border-b-2 border-gray-700'>
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((item, index) => (
              <tr key={index} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-6 py-4">{item.user?.name || 'Unknown'}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'Resolved' ? 'bg-green-100 text-green-800' : item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {item.status === 'Pending' && (
                    <>
                      <button onClick={() => updateStatus(item._id, 'Resolved')} className="text-white bg-green-500 px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors">Resolve</button>
                      <button onClick={() => updateStatus(item._id, 'Rejected')} className="text-white bg-red-500 px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filteredComplaints.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">No complaints found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageComplaints;
