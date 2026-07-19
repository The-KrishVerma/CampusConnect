import express from 'express';
import { submitComplaint, getMyComplaints, getAllComplaintsAdmin, updateComplaintStatus } from '../controllers/complaintController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Student routes
router.post('/submit', auth, submitComplaint);
router.get('/my-complaints', auth, getMyComplaints);

// Admin routes
router.get('/admin/all', adminAuth, getAllComplaintsAdmin);
router.post('/admin/update-status', adminAuth, updateComplaintStatus);

export default router;
