import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const Signup = () => {
  const { axios, navigate } = useAppContext();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post('/api/user/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      if (data.success) {
        localStorage.setItem('pendingEmail', form.email);
        toast.success('Check your email for the verification code.');
        navigate('/verify-email');
      } else {
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
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto bg-gray-800/70 border border-gray-700 rounded-2xl p-8">
          <h1 className="text-3xl font-semibold mb-2">Create your account</h1>
          <p className="text-gray-400 mb-8">Join CampusConnect to save and share your ideas.</p>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                className="w-full rounded-xl bg-gray-900/60 border border-gray-700 px-4 py-3 text-white outline-none focus:border-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                className="w-full rounded-xl bg-gray-900/60 border border-gray-700 px-4 py-3 text-white outline-none focus:border-primary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                required
                className="w-full rounded-xl bg-gray-900/60 border border-gray-700 px-4 py-3 text-white outline-none focus:border-primary"
                placeholder="Create a password"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                required
                className="w-full rounded-xl bg-gray-900/60 border border-gray-700 px-4 py-3 text-white outline-none focus:border-primary"
                placeholder="Repeat password"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <div className="mt-6 text-sm text-gray-400 text-center">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-primary hover:underline">
              Log in
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
