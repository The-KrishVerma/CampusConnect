import React, { useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const EditAnnouncement = () => {
  const { axios, navigate } = useAppContext();
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const fetchAnnouncement = async () => {
    try {
      const { data } = await axios.get(`/api/announcement/${id}`);
      if (data.success) {
        setTitle(data.announcement.title);
        setSubTitle(data.announcement.subTitle || '');
        setIsPublished(data.announcement.isPublished);
        setExistingImage(data.announcement.image);
        if (quillRef.current) {
          quillRef.current.root.innerHTML = data.announcement.description || '';
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append('id', id);
      formData.append('title', title);
      formData.append('subTitle', subTitle);
      formData.append('description', quillRef.current.root.innerHTML);
      formData.append('isPublished', isPublished);
      if (image) {
        formData.append('image', image);
      }
      const { data } = await axios.post('/api/announcement/update', formData);
      if (data.success) {
        toast.success(data.message);
        navigate('/admin/listAnnouncement');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
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
      fetchAnnouncement();
    }
  }, []);

  useEffect(() => {
    if (quillRef.current) fetchAnnouncement();
  }, [id]);

  return (
    <form onSubmit={onSubmitHandler} className="flex-1 text-gray-300 h-full overflow-y-auto p-4 md:p-10">
      <div className="bg-gray-800 w-full max-w-4xl p-6 md:p-10 m-auto shadow-lg rounded-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6 text-white">Edit Announcement Post</h2>
        
        <div className="mb-6">
          <p className="mb-2 font-medium text-lg">Upload Thumbnail</p>
          <label htmlFor="image" className="cursor-pointer">
            <div className="w-48 h-28 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center hover:border-primary transition-all overflow-hidden">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="preview" className="w-full h-full object-cover rounded-lg" />
              ) : existingImage ? (
                <img src={existingImage} alt="thumbnail" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <img src={assets.upload_area} alt="upload area" className="w-12" />
              )}
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
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
          <div className="relative h-80 pb-16 sm:pb-12 pt-2">
            <div ref={editorRef} className="h-full bg-gray-900 text-white"></div>
          </div>
        </div>


        <div className="flex items-center gap-4 mb-8">
          <p className="font-medium text-lg">Publish Now</p>
          <input type="checkbox" checked={isPublished} className="w-5 h-5 cursor-pointer accent-primary" onChange={(e) => setIsPublished(e.target.checked)} />
        </div>

        <button disabled={isSaving} type="submit" className="w-full sm:w-auto px-10 h-12 bg-primary text-white font-semibold rounded-lg cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditAnnouncement;
