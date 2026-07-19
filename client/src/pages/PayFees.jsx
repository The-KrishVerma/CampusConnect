import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PayFees = () => {
  const { token, backendUrl } = useAppContext();
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    description: 'Fall 2026 Semester'
  });

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/fee/my-payments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPayments(response.data.payments);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) fetchPayments();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/fee/pay`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ amount: '', description: 'Fall 2026 Semester' });
        fetchPayments();
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
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Pay Fees</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="e.g. Fall Semester, Library Fine"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-2"
            >
              Simulate Payment
            </button>
          </form>
        </div>

        <div className="w-full md:w-2/3 bg-white p-8 rounded-xl shadow-lg h-fit">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 border-b text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.description}</td>
                    <td className="px-6 py-4">${item.amount}</td>
                    <td className="px-6 py-4">{item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{item.transactionId || '-'}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">No payment history found.</td>
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

export default PayFees;
