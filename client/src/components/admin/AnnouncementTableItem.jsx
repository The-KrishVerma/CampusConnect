import React from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AnnouncementTableItem = ({ announcement, fetchAnnouncements, index }) => {
  const { title, createdAt, isPublished, _id } = announcement;
  const announcementDate = new Date(createdAt);

  const { axios, navigate } = useAppContext();

  const deleteAnnouncement = async () => {
    const confirm = window.confirm('Are you sure you want to delete this announcement?');
    if (!confirm) return;
    try {
      const { data } = await axios.post('/api/announcement/delete', { id: _id });
      if (data.success) {
        toast.success(data.message);
        await fetchAnnouncements();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePublish = async () => {
    try {
      const { data } = await axios.post('/api/announcement/toggle-publish', { id: _id });
      if (data.success) {
        toast.success(data.message);
        await fetchAnnouncements();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePin = async () => {
    try {
      const { data } = await axios.post('/api/announcement/toggle-pin', { id: _id });
      if (data.success) {
        toast.success(data.message);
        await fetchAnnouncements();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className='bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200'>
      <td className='px-4 py-4 xl:px-6 font-medium text-gray-300'>{index}</td>
      <td className='px-4 py-4 text-gray-300'>{title}</td>
      <td className='px-4 py-4 max-sm:hidden text-gray-400'>{announcementDate.toDateString()}</td>
      <td className='px-4 py-4 max-sm:hidden'>
        <p className={`${isPublished ? 'text-green-500' : 'text-yellow-500'}`}>
          {isPublished ? 'Published' : 'Draft'}
        </p>
      </td>
      <td className='px-4 py-4 flex items-center gap-3 text-xs'>
        <button
          onClick={() => navigate(`/admin/edit/${_id}`)}
          className="border rounded px-3 py-1 text-blue-400 border-blue-400 hover:bg-blue-400/10 transition-all duration-200"
        >
          Edit
        </button>
        <button
          onClick={togglePublish}
          className={`border rounded px-3 py-1 transition-all duration-200 ${isPublished
              ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/10'
              : 'border-green-500 text-green-500 hover:bg-green-500/10'
            }`}
        >
          {isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <button
          onClick={togglePin}
          className={`border rounded px-3 py-1 transition-all duration-200 ${announcement.isPinned
              ? 'border-orange-500 text-orange-500 hover:bg-orange-500/10'
              : 'border-purple-500 text-purple-500 hover:bg-purple-500/10'
            }`}
        >
          {announcement.isPinned ? 'Unpin' : 'Pin'}
        </button>
        <img
          src={assets.bin_icon}
          className='w-7 p-1 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-all cursor-pointer'
          alt="Delete"
          onClick={deleteAnnouncement}
        />
      </td>
    </tr>
  );
};

export default AnnouncementTableItem;
