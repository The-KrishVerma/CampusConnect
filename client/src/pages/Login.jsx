import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const UserLogin = () => {
  const { axios, navigate, setAuth, fetchMe } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axios.post('/api/user/login', { email, password });
      if (data.success) {
        setAuth(data.token, data.role || 'user');
        if (data.role === 'admin') {
          toast.success('Welcome Admin!');
          navigate('/admin');
        } else {
          await fetchMe();
          toast.success('Welcome back!');
          navigate('/');
        }
      } else {
        if (data.message?.toLowerCase().includes('not verified')) {
          localStorage.setItem('pendingEmail', email);
          toast.error('Please verify your email first.');
          navigate('/verify-email');
          return;
        }
        toast.error(data.message);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto bg-gray-800/70 border border-gray-700 rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-2">Welcome back</h1>
          <p className="text-gray-400 mb-8">Log in to continue your CampusConnect journey.</p>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl bg-gray-900/60 border border-gray-700 px-4 py-3 text-white outline-none focus:border-primary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl bg-gray-900/60 border border-gray-700 px-4 py-3 text-white outline-none focus:border-primary"
                placeholder="Your password"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          <div className="mt-6 text-sm text-gray-400 flex justify-between">
            <button onClick={() => navigate('/forgot-password')} className="hover:text-primary">
              Forgot password?
            </button>
            <button onClick={() => navigate('/signup')} className="hover:text-primary">
              Create account
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLogin;
