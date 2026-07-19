import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import Navbar from '../components/Navbar';
import Moment from 'moment';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Announcement = () => {
  const { id } = useParams();
  const { axios, user, role } = useAppContext();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');

  const fetchAnnouncementData = async () => {
    try {
      const { data } = await axios.get(`/api/announcement/${id}`);
      data.success ? setData(data.announcement) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.post('/api/announcement/comments', { announcementId: id });
      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const commentData = {
        announcement: id,
        content: content,
        name: role === 'admin' ? 'Admin' : user.name,
      };

      const { data } = await axios.post('/api/announcement/add-comment', commentData);

      if (data.success) {
        toast.success(data.message);
        setContent('');
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAnnouncementData();
    fetchComments();
  }, []);

  return data ? (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="text-center mt-20">
        <p className="text-primary py-4 font-medium">Published on {Moment(data.createdAt).format('MMMM Do YYYY')}</p>
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-3xl mx-auto px-4">{data.title}</h1>
        <p className="my-5 max-w-lg mx-auto text-gray-400">{data.subTitle}</p>
        <p className="inline-block py-1 px-4 rounded-full mb-6 border border-primary/35 bg-primary/10 font-medium text-primary">Author Admin</p>
      </div>
      <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
        <img src={data.image} alt="" className="rounded-3xl mb-10 shadow-lg" />
        <div className="rich-text max-w-3xl mx-auto text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: data.description }}></div>

        {/* Add Comment Section */}
        {user || role === 'admin' ? (
          <div className="max-w-3xl mx-auto my-16">
            <p className="font-semibold mb-6 text-xl">Add your comment</p>
            <form onSubmit={addComment} className="flex flex-col items-start gap-4 max-w-4xl">
              <textarea
                onChange={(e) => setContent(e.target.value)}
                value={content}
                placeholder="Comment"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg outline-none h-12 text-gray-300 placeholder-gray-500"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-primary text-white rounded-lg py-3 px-8 hover:bg-primary/90 transition-all cursor-pointer"
              >
                Submit
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto my-16 text-center">
            <p className="font-semibold mb-6 text-xl">Login to comment</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary text-white rounded-lg py-3 px-8 hover:bg-primary/90 transition-all cursor-pointer"
            >
              Login
            </button>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-16 mb-8 max-w-3xl mx-auto">
          <p className="font-semibold mb-6 text-xl">Comments ({comments.length})</p>
          <div className="flex flex-col gap-2">
            {comments.map((item, index) => (
              <div key={index} className="relative bg-gray-800 border border-gray-700 p-5 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <img src={assets.user_icon} alt="" className="w-7" />
                  <p className="font-medium text-gray-200">{item.name}</p>
                </div>
                <p className="text-sm text-gray-400 ml-10">{item.content}</p>
                <div className="absolute right-5 bottom-4 text-xs text-gray-500">{Moment(item.createdAt).fromNow()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Button */}
        <div className="mt-8 mb-12 max-w-3xl mx-auto">
          <p className="font-semibold my-2 text-xl">Share this article</p>
          <div className="flex gap-4">
            <a href="#"><img src={assets.facebook_icon} width={40} alt="" className="opacity-80 hover:opacity-100" /></a>
            <a href="#"><img src={assets.twitter_icon} width={40} alt="" className="opacity-80 hover:opacity-100" /></a>
            <a href="#"><img src={assets.googleplus_icon} width={40} alt="" className="opacity-80 hover:opacity-100" /></a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ) : <Loader />;
};

export default Announcement;
