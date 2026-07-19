import React from 'react';
import { useNavigate } from 'react-router-dom';

const AnnouncementCard = ({ announcement }) => {
  const { title, description, category, image, _id } = announcement;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/announcement/${_id}`)}
      className="w-full rounded-lg overflow-hidden bg-gray-800 border border-gray-700 hover:shadow-lg hover:shadow-primary/25 duration-300 cursor-pointer group"
    >
      <img src={image} alt="" className="aspect-video group-hover:scale-105 transition-transform duration-300" />
      <div className="p-5">
        <span className="mb-2 inline-block bg-primary/20 rounded-full text-primary text-xs px-3 py-1">{category}</span>
        <h5 className="my-2 font-medium text-white group-hover:text-primary transition-colors duration-300">{title}</h5>
        <div className="mb-3 text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: description.slice(0, 100) }}></div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
