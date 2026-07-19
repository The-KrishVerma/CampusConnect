import React, { useState } from 'react';

import AnnouncementCard from './AnnouncementCard';
import { useAppContext } from '../context/AppContext';

const AnnouncementList = ({ sortOption = 'newest' }) => {
    const { announcements, input } = useAppContext();
    const [visibleCount, setVisibleCount] = useState(12);

    const filteredAnnouncements = () => {
        let filtered = announcements;
        if (input !== '') {
            filtered = announcements.filter((announcement) =>
                announcement.title.toLowerCase().includes(input.toLowerCase())
            );
        }


        return filtered;
    };

    const sortedAnnouncements = filteredAnnouncements()
        .slice()
        .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="flex flex-col items-center">
            <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='overflow-y-auto h-fit pb-12'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
                        {sortedAnnouncements
                            .slice(0, visibleCount)
                            .map((announcement) => (
                                <AnnouncementCard key={announcement._id} announcement={announcement} />
                            ))}
                    </div>
                </div>
            </div>

            {sortedAnnouncements.length === 0 && (
                <p className="text-gray-400 text-sm mb-24">No announcements match your search.</p>
            )}

            {sortedAnnouncements.length > visibleCount && (
                <div className="mt-8 mb-12">
                    <button
                        onClick={() => setVisibleCount((prev) => prev + 12)}
                        className="bg-primary/20 text-primary border border-primary/50 px-8 py-2.5 rounded-full font-medium hover:bg-primary hover:text-white transition-all duration-300"
                    >
                        View More
                    </button>
                </div>
            )}
        </div>
    );
};

export default AnnouncementList;
