import React, { useEffect, useState } from 'react';
import AnnouncementTableItem from '../../components/admin/AnnouncementTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ListAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const { axios } = useAppContext();

  const fetchAnnouncements = async () => {
    try {
      const { data } = await axios.get('/api/admin/announcements');
      if (data.success) {
        setAnnouncements(data.announcements);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className='flex-1 p-4 md:p-10 text-white'>
      <h1 className='text-2xl font-semibold mb-6'>All Announcement Posts</h1>

      <div className='relative overflow-x-auto bg-gray-800 shadow-lg rounded-lg border border-gray-700'>
        <table className='w-full text-sm text-left text-gray-400'>
          <thead className='text-xs text-gray-400 uppercase bg-gray-800 border-b-2 border-gray-700'>
            <tr>
              <th scope='col' className='px-4 py-4 xl:px-6'>#</th>
              <th scope='col' className='px-4 py-4'>Announcement Title</th>
              <th scope='col' className='px-4 py-4 max-sm:hidden'>Date</th>
              <th scope='col' className='px-4 py-4 max-sm:hidden'>Status</th>
              <th scope='col' className='px-4 py-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <AnnouncementTableItem key={announcement._id} announcement={announcement} fetchAnnouncements={fetchAnnouncements} index={index + 1} />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">No announcements found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListAnnouncement;
