import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Announcement from './pages/Announcement';
import Layout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import AddAnnouncement from './pages/admin/AddAnnouncement';
import ListAnnouncement from './pages/admin/ListAnnouncement';
import Comments from './pages/admin/Comments';
import Login from './components/admin/Login';
import Signup from './pages/Signup';
import EditAnnouncement from './pages/admin/EditAnnouncement';
import UserLogin from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import RegisterComplaint from './pages/RegisterComplaint';
import BookAccommodation from './pages/BookAccommodation';
import PayFees from './pages/PayFees';
import IssueBook from './pages/IssueBook';
import RegisterCourse from './pages/RegisterCourse';
import ManageComplaints from './pages/admin/ManageComplaints';
import ManageBookings from './pages/admin/ManageBookings';
import ManageFees from './pages/admin/ManageFees';
import ManageLibrary from './pages/admin/ManageLibrary';
import ManageCourses from './pages/admin/ManageCourses';
import 'quill/dist/quill.snow.css';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';

const App = () => {
  const { token, role } = useAppContext();

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/announcement/:id" element={<Announcement />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register-complaint" element={token ? <RegisterComplaint /> : <UserLogin />} />
        <Route path="/book-accommodation" element={token ? <BookAccommodation /> : <UserLogin />} />
        <Route path="/pay-fees" element={token ? <PayFees /> : <UserLogin />} />
        <Route path="/issue-book" element={token ? <IssueBook /> : <UserLogin />} />
        <Route path="/register-course" element={token ? <RegisterCourse /> : <UserLogin />} />
        <Route path="/admin" element={token && role === 'admin' ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path="addAnnouncement" element={<AddAnnouncement />} />
          <Route path="listAnnouncement" element={<ListAnnouncement />} />
          <Route path="comments" element={<Comments />} />
          <Route path="edit/:id" element={<EditAnnouncement />} />
          <Route path="complaints" element={<ManageComplaints />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="fees" element={<ManageFees />} />
          <Route path="library" element={<ManageLibrary />} />
          <Route path="courses" element={<ManageCourses />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
