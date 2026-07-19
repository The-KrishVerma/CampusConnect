import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const { navigate, token, role, user, setAuth } = useAppContext();
  const location = useLocation();

  const handleLogout = () => {
    setAuth(null, null);
    navigate('/');
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div
            className="text-2xl font-bold text-white"
          >
            CampusConnect
          </div>
          <div className="flex items-center gap-3">
            {!token && (
              <>
                {location.pathname === '/login' ? (
                  <button
                    onClick={() => navigate('/signup')}
                    className="flex items-center gap-2 rounded-full text-sm font-medium
                      cursor-pointer bg-primary text-white px-6 py-2.5 hover:bg-primary/90
                      transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    Sign up
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 rounded-full text-sm font-medium
                      cursor-pointer bg-primary text-white px-6 py-2.5 hover:bg-primary/90
                      transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    Login
                  </button>
                )}
              </>
            )}
            {token && role === 'admin' && (
              <>
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 rounded-full text-sm font-medium
                    cursor-pointer bg-primary text-white px-6 py-2.5 hover:bg-primary/90
                    transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            )}
            {token && role === 'user' && (
              <>
                {!['/', '/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'].includes(location.pathname) && (
                  <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 rounded-full text-sm font-medium
                      cursor-pointer bg-primary text-white px-6 py-2.5 hover:bg-primary/90
                      transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    Home
                  </button>
                )}
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 rounded-full text-sm font-medium
                    cursor-pointer bg-primary text-white px-6 py-2.5 hover:bg-primary/90
                    transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  {user?.name || 'Profile'}
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
