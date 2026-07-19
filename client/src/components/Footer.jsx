import React from 'react';
import { assets, footer_data } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-0.5 font-['cursive']">CampusConnect</h3>
            <p className="text-sm leading-relaxed">
              Your campus announcementging platform. Share your stories with the university community and connect with fellow students.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footer_data.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">{section.title}</h3>
                <ul className="text-sm space-y-3">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="hover:text-primary transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2025 CampusConnect. All rights reserved.
            <br />
            Developed by Krish Verma.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
