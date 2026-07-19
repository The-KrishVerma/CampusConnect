import React, { useEffect, useState } from 'react';
import CommentTableItem from '../../components/admin/CommentTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { axios } = useAppContext();

  const fetchComments = async () => {
    try {
      const { data } = await axios.get('/api/admin/comments');
      data.success ? setComments(data.comments) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const getButtonClass = (buttonFilter) => {
    return `border rounded-full px-4 py-1.5 cursor-pointer text-xs transition-all duration-200 ${filter === buttonFilter
        ? 'bg-primary text-white border-primary'
        : 'text-gray-300 border-gray-600 hover:bg-gray-700'
      }`;
  };

  const filteredComments = comments
    .filter((comment) => {
      if (filter === 'All') return true;
      if (filter === 'Approved') return comment.isApproved === true;
      if (filter === 'Pending') return comment.isApproved === false;
      return true;
    })
    .filter((comment) => {
      if (!search) return true;
      const haystack = `${comment?.announcement?.title || ''} ${comment?.name || ''} ${comment?.content || ''}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });

  const approvedCount = comments.filter((comment) => comment.isApproved).length;
  const pendingCount = comments.length - approvedCount;

  return (
    <div className='flex-1 p-4 md:p-10 text-white'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>Comments</h1>
          <p className='text-xs text-gray-400 mt-1'>Approved {approvedCount} · Pending {pendingCount}</p>
        </div>
        <div className='flex flex-col sm:flex-row gap-3'>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search comments..."
            className="bg-gray-800 border border-gray-700 text-sm rounded-full px-4 py-2 text-gray-300 outline-none focus:border-primary"
          />
          <div className='flex flex-wrap gap-3'>
            <button onClick={() => setFilter('All')} className={getButtonClass('All')}>All</button>
            <button onClick={() => setFilter('Approved')} className={getButtonClass('Approved')}>Approved</button>
            <button onClick={() => setFilter('Pending')} className={getButtonClass('Pending')}>Pending</button>
          </div>
        </div>
      </div>

      <div className='relative overflow-x-auto bg-gray-800 shadow-lg rounded-lg border border-gray-700'>
        <table className='w-full text-sm text-left text-gray-400'>
          <thead className='text-xs text-gray-400 uppercase bg-gray-800 border-b-2 border-gray-700'>
            <tr>
              <th scope='col' className='px-6 py-4'>Announcement Title & Comment</th>
              <th scope='col' className='px-6 py-4 max-sm:hidden'>Date</th>
              <th scope='col' className='px-6 py-4'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.length > 0 ? (
              filteredComments.map((comment, index) => (
                <CommentTableItem key={comment._id} comment={comment} fetchComments={fetchComments} />
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-500">No comments to display.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comments;
