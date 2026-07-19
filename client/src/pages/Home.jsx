import React, { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import AnnouncementList from '../components/AnnouncementList';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaClipboardList, FaBook, FaMoneyBillWave, FaGraduationCap } from 'react-icons/fa';

const Home = () => {
  const { user, setInput, input, announcements } = useAppContext();
  const navigate = useNavigate();
  const inputRef = useRef();
  const [pinIndex, setPinIndex] = useState(0);
  const [sortOption, setSortOption] = useState("newest");

  const pinnedAnnouncements = announcements ? announcements.filter(a => a.isPinned) : [];

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setInput(inputRef.current.value);
  };

  const onClear = () => {
    setInput('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <Header />
      <main className="container mx-auto px-4 pt-6 pb-12">
        <div className="mb-6">
          <h2 className="text-xl font-bold pb-2 border-b border-gray-800">Services Offered</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <div 
            onClick={() => navigate('/register-course')}
            className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 flex flex-col items-center text-center gap-4 group"
          >
            <div className="bg-primary/20 p-4 rounded-full text-primary group-hover:scale-110 transition-transform">
              <FaGraduationCap size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Courses</h3>
              <p className="text-gray-400 text-xs mt-1">Register for semester courses.</p>
            </div>
          </div>

          <div 
            onClick={() => navigate('/book-accommodation')}
            className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 flex flex-col items-center text-center gap-4 group"
          >
            <div className="bg-primary/20 p-4 rounded-full text-primary group-hover:scale-110 transition-transform">
              <FaBuilding size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Bookings</h3>
              <p className="text-gray-400 text-xs mt-1">Reserve a visitor hostel for campus visitors.</p>
            </div>
          </div>
          
          <div 
            onClick={() => navigate('/register-complaint')}
            className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 flex flex-col items-center text-center gap-4 group"
          >
            <div className="bg-primary/20 p-4 rounded-full text-primary group-hover:scale-110 transition-transform">
              <FaClipboardList size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Complaints</h3>
              <p className="text-gray-400 text-xs mt-1">Submit maintenance, academic, or visitor hostel issues.</p>
            </div>
          </div>

          <div 
            onClick={() => navigate('/issue-book')}
            className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 flex flex-col items-center text-center gap-4 group"
          >
            <div className="bg-primary/20 p-4 rounded-full text-primary group-hover:scale-110 transition-transform">
              <FaBook size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Library</h3>
              <p className="text-gray-400 text-xs mt-1">Request to issue books from the campus library.</p>
            </div>
          </div>

          <div 
            onClick={() => navigate('/pay-fees')}
            className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 flex flex-col items-center text-center gap-4 group"
          >
            <div className="bg-primary/20 p-4 rounded-full text-primary group-hover:scale-110 transition-transform">
              <FaMoneyBillWave size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Pay Fees</h3>
              <p className="text-gray-400 text-xs mt-1">Simulate payment for academic or other fees.</p>
            </div>
          </div>
        </div>
        
        {/* Find Announcements section removed from here as per user request */}

        {pinnedAnnouncements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-800 text-orange-500 flex items-center gap-2">
              📌 Pinned
            </h2>
            <div 
              onClick={() => setPinIndex((prev) => (prev + 1) % pinnedAnnouncements.length)}
              className="bg-gray-800 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-lg cursor-pointer hover:bg-gray-700 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <h3 className="text-lg font-bold text-white">{pinnedAnnouncements[pinIndex].title}</h3>
                <p className="text-sm text-gray-400 line-clamp-1">{pinnedAnnouncements[pinIndex].subTitle || "Click Read More to view details."}</p>
                {pinnedAnnouncements.length > 1 && (
                  <p className="text-xs text-orange-400 mt-2 cursor-pointer">Click to see next pinned announcement ({pinIndex + 1}/{pinnedAnnouncements.length})</p>
                )}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/announcement/${pinnedAnnouncements[pinIndex]._id}`);
                }}
                className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Read More
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-2 border-b border-gray-800 gap-4 mt-16">
          <h2 className="text-2xl font-bold">Latest Announcements</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <select 
              className="bg-gray-800 border border-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-primary text-gray-300 w-full sm:w-auto"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            
            <form onSubmit={onSubmitHandler} className="relative w-full sm:w-64">
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Search..." 
                defaultValue={input}
                className="w-full bg-gray-800 border border-gray-700 text-sm rounded-full pl-4 pr-10 py-2 outline-none focus:border-primary text-gray-300"
              />
              {input ? (
                 <button type="button" onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-xs cursor-pointer">
                    ✕
                 </button>
              ) : (
                 <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary cursor-pointer text-xs">
                   🔍
                 </button>
              )}
            </form>
          </div>
        </div>
        <AnnouncementList sortOption={sortOption} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
