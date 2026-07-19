import express from 'express';
import { submitBookRequest, getMyLibraryRequests, getAllLibraryRequestsAdmin, updateBookStatus } from '../controllers/libraryController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Student routes
router.post('/request', auth, submitBookRequest);
router.get('/my-requests', auth, getMyLibraryRequests);

// Admin routes
router.get('/admin/all', adminAuth, getAllLibraryRequestsAdmin);
router.post('/admin/update-status', adminAuth, updateBookStatus);

export default router;
