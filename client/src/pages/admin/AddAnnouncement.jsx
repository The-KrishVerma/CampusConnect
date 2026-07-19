import React, { useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { parse } from 'marked';

const AddAnnouncement = () => {
  const { axios, user } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const generateContent = async () => {
    if (!title) return toast.error('Please enter a title to generate content.');
    try {
      setLoading(true);
      const { data } = await axios.post('/api/announcement/generate', { prompt: title });
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content);
        toast.success('Content generated successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsAdding(true);

      const announcement = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        isPublished,
      };

      const formData = new FormData();
      formData.append('announcement', JSON.stringify(announcement));
      formData.append('image', image);

      const { data } = await axios.post('/api/announcement/add', formData);

      if (data.success) {
        toast.success(data.message);
        // Reset form
        setImage(null);
        setTitle('');
        setSubTitle('');
        quillRef.current.root.innerHTML = '';
        setIsPublished(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
          ],
        },
      });
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className="flex-1 text-gray-300 h-full overflow-y-auto p-4 md:p-10">
      <div className="bg-gray-800 w-full max-w-4xl p-6 md:p-10 m-auto shadow-lg rounded-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6 text-white">Add New Announcement Post</h2>
        
        <div className="mb-6">
          <p className="mb-2 font-medium text-lg">Upload Thumbnail</p>
          <label htmlFor="image" className="cursor-pointer">
            <div className="w-48 h-28 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center hover:border-primary transition-all">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <img src={assets.upload_area} alt="upload area" className="w-12" />
              )}
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
          </label>
        </div>

        <div className="mb-6">
          <p className="mb-2 font-medium text-lg">Announcement Title</p>
          <input type="text" placeholder="Enter title..." required className="form-input text-lg" onChange={(e) => setTitle(e.target.value)} value={title} />
        </div>

        <div className="mb-6">
          <p className="mb-2 font-medium text-lg">Sub-Title</p>
          <input type="text" placeholder="Enter sub-title..." required className="form-input text-lg" onChange={(e) => setSubTitle(e.target.value)} value={subTitle} />
        </div>

        <div className="mb-6">
          <p className="mb-2 font-medium text-lg">Announcement Description</p>
          <div className="relative">
            <div ref={editorRef} className="bg-gray-900 text-white" style={{ height: '300px' }}></div>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <div className="w-10 h-10 rounded-full border-4 border-t-primary animate-spin"></div>
              </div>
            )}
            <button disabled={loading} type="button" onClick={generateContent} className="absolute bottom-4 right-4 text-xs text-white bg-primary px-4 py-2 rounded-full hover:bg-primary/90 transition-all cursor-pointer shadow-md">
              Generate with AI
            </button>
          </div>
        </div>


        <div className="flex items-center gap-4 mb-8">
          <p className="font-medium text-lg">Publish Now</p>
          <input type="checkbox" checked={isPublished} className="w-5 h-5 cursor-pointer accent-primary" onChange={(e) => setIsPublished(e.target.checked)} />
        </div>

        <button disabled={isAdding} type="submit" className="w-full sm:w-auto px-10 h-12 bg-primary text-white font-semibold rounded-lg cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {isAdding ? 'Adding...' : 'Add Announcement'}
        </button>
      </div>
    </form>
  );
};

export default AddAnnouncement;
