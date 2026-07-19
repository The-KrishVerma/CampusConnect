import React from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const CommentTableItem = ({ comment, fetchComments }) => {
  const { announcement, createdAt, _id, name, content, isApproved } = comment;
  const announcementDate = new Date(createdAt);
  const { axios } = useAppContext();

  const approveComment = async () => {
    try {
      const { data } = await axios.post('/api/admin/approve-comment', { id: _id });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteComment = async () => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this comment?');
      if (!confirm) return;
      const { data } = await axios.post('/api/admin/delete-comment', { id: _id });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className='bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200'>
      <td className='px-6 py-4'>
        <p className='font-semibold text-gray-300'>
          <span className='font-medium text-gray-400'>Announcement:</span> {announcement?.title || 'Deleted announcement'}
        </p>
        <p className='text-sm text-gray-400 mt-2'>
          <span className='font-medium text-gray-300'>Name:</span> {name}
        </p>
        <p className='text-sm text-gray-400 mt-1'>
          <span className='font-medium text-gray-300'>Comment:</span> {content}
        </p>
      </td>
      <td className='px-6 py-4 max-sm:hidden align-top text-gray-400'>
        {announcementDate.toLocaleDateString()}
      </td>
      <td className='px-6 py-4 align-top'>
        <div className='inline-flex items-center gap-4'>
          {!isApproved ? (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              className='w-7 p-1 rounded-full bg-green-500/20 hover:bg-green-500/40 transition-all cursor-pointer'
              alt="Approve"
            />
          ) : (
            <p className='text-xs border border-green-500 bg-green-500/10 text-green-400 rounded-full px-3 py-1'>
              Approved
            </p>
          )}
          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt="Delete"
            className='w-7 p-1 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-all cursor-pointer'
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
