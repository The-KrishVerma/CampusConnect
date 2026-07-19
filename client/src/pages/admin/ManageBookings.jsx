import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const ManageBookings = () => {
  const { backendUrl, token } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');

  const getButtonClass = (buttonFilter) => {
    return `border rounded-full px-4 py-1.5 cursor-pointer text-xs transition-all duration-200 ${
      filter === buttonFilter
        ? 'bg-primary text-white border-primary'
        : 'text-gray-300 border-gray-600 hover:bg-gray-700'
    }`;
  };

  const filteredBookings = bookings.filter((item) => {
    if (filter === 'All') return true;
    if (filter === 'Accepted') return item.status === 'Approved';
    if (filter === 'Pending') return item.status === 'Pending';
    if (filter === 'Decline') return item.status === 'Rejected';
    return true;
  });

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/booking/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.post(`${backendUrl}/api/booking/admin/update-status`, { id, status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchBookings();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className='flex-1 p-4 md:p-10 text-white'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4'>
        <h1 className='text-2xl font-semibold'>Manage Bookings</h1>
        <div className='flex flex-wrap gap-3'>
          <button onClick={() => setFilter('All')} className={getButtonClass('All')}>All</button>
          <button onClick={() => setFilter('Accepted')} className={getButtonClass('Accepted')}>Accepted</button>
          <button onClick={() => setFilter('Pending')} className={getButtonClass('Pending')}>Pending</button>
          <button onClick={() => setFilter('Decline')} className={getButtonClass('Decline')}>Decline</button>
        </div>
      </div>
      <div className='relative overflow-x-auto bg-gray-800 shadow-lg rounded-lg border border-gray-700'>
        <table className='w-full text-sm text-left text-gray-400'>
          <thead className='text-xs text-gray-400 uppercase bg-gray-800 border-b-2 border-gray-700'>
            <tr>
              <th className="px-6 py-3">Student</th>
              <th className="px-6 py-3">Guest Name</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Dates</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((item, index) => (
              <tr key={index} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-6 py-4">{item.user?.name || 'Unknown'}</td>
                <td className="px-6 py-4 font-medium text-white">{item.guestName}</td>
                <td className="px-6 py-4">{item.accommodationType}</td>
                <td className="px-6 py-4 text-xs whitespace-nowrap">
                  {formatDate(item.checkInDate)} - {formatDate(item.checkOutDate)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'Approved' ? 'bg-green-100 text-green-800' : item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {item.status === 'Pending' && (
                    <>
                      <button onClick={() => updateStatus(item._id, 'Approved')} className="text-white bg-green-500 px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors">Approve</button>
                      <button onClick={() => updateStatus(item._id, 'Rejected')} className="text-white bg-red-500 px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
