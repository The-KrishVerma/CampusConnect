import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
  const { setAuth, navigate } = useAppContext();

  const logout = () => {
    setAuth(null, null);
    navigate('/');
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-12">
          <div className="flex items-center justify-between py-3 h-[70px]">
            <button
              onClick={() => navigate('/')}
              className="text-sm px-6 py-2.5 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors duration-300"
            >
              View Announcements
            </button>
            <button
              onClick={logout}
              className="text-sm px-6 py-2.5 bg-gray-700 text-white rounded-full cursor-pointer hover:bg-gray-600 transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-col md:flex-row md:h-[calc(100vh-70px)]">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
