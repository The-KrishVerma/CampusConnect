import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from 'date-fns';

const BookAccommodation = () => {
  const { token, backendUrl } = useAppContext();
  const [formData, setFormData] = useState({
    guestName: '',
    accommodationType: 'Visitor Hostel'
  });
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/booking/booked-dates`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setBookedDates(response.data.bookedDates.map(date => parseISO(date)));
        }
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    };
    if (token) fetchBookedDates();
  }, [token, backendUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate) {
      return toast.error("Please select both check-in and check-out dates.");
    }
    try {
      const payload = { ...formData, checkInDate, checkOutDate };
      const response = await axios.post(`${backendUrl}/api/booking/submit`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ guestName: '', accommodationType: 'Visitor Hostel' });
        setCheckInDate(null);
        setCheckOutDate(null);
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
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Book Accommodation</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="Name of the guest"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation Type</label>
              <select
                name="accommodationType"
                value={formData.accommodationType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="Visitor Hostel">Visitor Hostel</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                <DatePicker
                  selected={checkInDate}
                  onChange={(date) => setCheckInDate(date)}
                  selectsStart
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  minDate={new Date()}
                  excludeDates={bookedDates}
                  placeholderText="Select Check-in Date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                <DatePicker
                  selected={checkOutDate}
                  onChange={(date) => setCheckOutDate(date)}
                  selectsEnd
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  minDate={checkInDate || new Date()}
                  excludeDates={bookedDates}
                  placeholderText="Select Check-out Date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-2"
            >
              Request Booking
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookAccommodation;
