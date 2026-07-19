import express from 'express';
import { 
    getAvailableCourses, 
    getMyRegisteredCourses, 
    registerCourse, 
    dropCourse,
    addCourse,
    removeCourse,
    toggleFreezeCourse
} from '../controllers/courseController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Student routes
router.get('/available', auth, getAvailableCourses);
router.get('/my-courses', auth, getMyRegisteredCourses);
router.post('/register', auth, registerCourse);
router.post('/drop', auth, dropCourse);

// Admin routes
router.post('/admin/add', adminAuth, addCourse);
router.post('/admin/remove', adminAuth, removeCourse);
router.post('/admin/toggle-freeze', adminAuth, toggleFreezeCourse);
// Admins also need to see available courses for management
router.get('/admin/all', adminAuth, getAvailableCourses); 

export default router;
