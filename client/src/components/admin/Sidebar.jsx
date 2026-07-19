import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Sidebar = () => {
  const activeLinkClass = "bg-primary/10 border-b-4 md:border-r-4 md:border-b-0 border-primary text-white";
  const inactiveLinkClass = "text-gray-400 hover:bg-gray-700 hover:text-white";

  return (
    <aside className="bg-gray-800 text-gray-300 flex md:flex-col md:w-64 w-full md:h-full">
      <nav className="flex md:flex-col w-full justify-around md:justify-start md:gap-2">
        <NavLink
          end={true}
          to='/admin'
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 py-3 md:flex-row md:justify-start md:gap-4 md:py-3.5 md:px-6 cursor-pointer transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
          }
        >
          <img src={assets.home_icon} alt="" className="w-5 icon-white" />
          <p className="font-medium text-xs md:text-base">Dashboard</p>
        </NavLink>

        <NavLink
          to='/admin/addAnnouncement'
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 py-3 md:flex-row md:justify-start md:gap-4 md:py-3.5 md:px-6 cursor-pointer transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
          }
        >
          <img src={assets.add_icon} alt="" className="w-5 icon-white" />
          <p className="font-medium text-xs md:text-base">Add Announcement</p>
        </NavLink>



        <NavLink
          to='/admin/bookings'
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 py-3 md:flex-row md:justify-start md:gap-4 md:py-3.5 md:px-6 cursor-pointer transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
          }
        >
          <img src={assets.list_icon} alt="" className="w-5 icon-white" />
          <p className="font-medium text-xs md:text-base">Manage Bookings</p>
        </NavLink>

        <NavLink
          to='/admin/complaints'
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 py-3 md:flex-row md:justify-start md:gap-4 md:py-3.5 md:px-6 cursor-pointer transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
          }
        >
          <img src={assets.list_icon} alt="" className="w-5 icon-white" />
          <p className="font-medium text-xs md:text-base">Manage Complaints</p>
        </NavLink>

        <NavLink
          to='/admin/library'
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 py-3 md:flex-row md:justify-start md:gap-4 md:py-3.5 md:px-6 cursor-pointer transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
          }
        >
          <img src={assets.list_icon} alt="" className="w-5 icon-white" />
          <p className="font-medium text-xs md:text-base">Manage Library</p>
        </NavLink>

        <NavLink
          to='/admin/fees'
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 py-3 md:flex-row md:justify-start md:gap-4 md:py-3.5 md:px-6 cursor-pointer transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
          }
        >
          <img src={assets.list_icon} alt="" className="w-5 icon-white" />
          <p className="font-medium text-xs md:text-base">Manage Fees</p>
        </NavLink>

        <NavLink
          to='/admin/courses'
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 py-3 md:flex-row md:justify-start md:gap-4 md:py-3.5 md:px-6 cursor-pointer transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
          }
        >
          <img src={assets.list_icon} alt="" className="w-5 icon-white" />
          <p className="font-medium text-xs md:text-base">Manage Courses</p>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
