import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import AnnouncementTableItem from '../../components/admin/AnnouncementTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    announcements: 0,
    comments: 0,
    drafts: 0,
    pendingComments: 0,
    recentAnnouncements: [],
  });

  const { axios, navigate } = useAppContext();

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard');
      if (data.success) {
        // Sort the recentAnnouncements array in descending order of creation date
        const sortedAnnouncements = data.dashboardData.recentAnnouncements.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDashboardData({ ...data.dashboardData, recentAnnouncements: sortedAnnouncements });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="flex-1 p-4 md:p-10 text-white">
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard icon={assets.dashboard_icon_1} value={dashboardData.announcements} label="Total Announcements" onClick={() => navigate('/admin/listAnnouncement')} />
        <StatCard icon={assets.dashboard_icon_2} value={dashboardData.comments} label={`Comments (${dashboardData.pendingComments} Pending)`} onClick={() => navigate('/admin/comments')} />
        <StatCard icon={assets.dashboard_icon_3} value={dashboardData.drafts} label="Drafts" />
      </div>

      <div>
        <div className="flex items-center gap-3 mb-6">
          <img src={assets.dashboard_icon_4} alt="" className="w-6" />
          <h3 className="text-xl font-semibold">Latest Announcements</h3>
        </div>
        <div className="relative overflow-x-auto bg-gray-800 shadow-lg rounded-lg">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-400 uppercase bg-gray-800 border-b-2 border-gray-700">
              <tr>
                <th scope="col" className="px-4 py-4 xl:px-6">#</th>
                <th scope="col" className="px-4 py-4">Announcement Title</th>
                <th scope="col" className="px-4 py-4 max-sm:hidden">Date</th>
                <th scope="col" className="px-4 py-4 max-sm:hidden">Status</th>
                <th scope="col" className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentAnnouncements.map((announcement, index) => (
                <AnnouncementTableItem key={announcement._id} announcement={announcement} fetchAnnouncements={fetchDashboard} index={index + 1} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-5 bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-md hover:shadow-primary/25 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}>
    <img src={icon} alt="" className="w-12 h-12" />
    <div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="text-gray-400 font-light">{label}</p>
    </div>
  </div>
);

export default Dashboard;
