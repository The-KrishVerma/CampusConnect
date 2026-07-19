import express from 'express';
import { initiatePayment, getMyPayments, getAllPaymentsAdmin, addPendingFeeAdmin } from '../controllers/feeController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Student routes
router.post('/pay', auth, initiatePayment);
router.get('/my-payments', auth, getMyPayments);

// Admin routes
router.get('/admin/all', adminAuth, getAllPaymentsAdmin);
router.post('/admin/add', adminAuth, addPendingFeeAdmin);

export default router;
