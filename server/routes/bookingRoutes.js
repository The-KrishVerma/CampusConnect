import express from 'express';
import { 
    submitBooking, 
    getMyBookings, 
    getAllBookingsAdmin, 
    updateBookingStatus,
    getBookedDates
} from '../controllers/bookingController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Student routes
router.get('/booked-dates', auth, getBookedDates);
router.post('/submit', auth, submitBooking);
router.get('/my-bookings', auth, getMyBookings);

// Admin routes
router.get('/admin/all', adminAuth, getAllBookingsAdmin);
router.post('/admin/update-status', adminAuth, updateBookingStatus);

export default router;
