import Course from '../models/Course.js';
import CourseRegistration from '../models/CourseRegistration.js';

// --- STUDENT ACTIONS ---

// Get all available courses
export const getAvailableCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json({success: true, courses});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Get student's registered courses
export const getMyRegisteredCourses = async (req, res) => {
    try {
        const registrations = await CourseRegistration.find({
            user: req.userId,
            status: 'Registered'
        }).populate('course');
        res.json({success: true, registrations});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Register for a course
export const registerCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        
        // 1. Check if course exists, is frozen, and has capacity
        const course = await Course.findById(courseId);
        if (!course) return res.json({success: false, message: "Course not found"});
        if (course.isFrozen) {
            return res.json({success: false, message: "Course registration is frozen by admin"});
        }
        if (course.enrolledCount >= course.capacity) {
            return res.json({success: false, message: "Course is full"});
        }

        // 2. Check if already registered
        const existingReg = await CourseRegistration.findOne({
            user: req.userId,
            course: courseId,
            status: 'Registered'
        });
        if (existingReg) {
            return res.json({success: false, message: "Already registered for this course"});
        }

        // 3. Register and increment count
        await CourseRegistration.create({
            user: req.userId,
            course: courseId,
        });

        course.enrolledCount += 1;
        await course.save();

        res.json({success: true, message: "Successfully registered for course"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Drop a course
export const dropCourse = async (req, res) => {
    try {
        const { registrationId } = req.body;
        
        const registration = await CourseRegistration.findById(registrationId);
        if (!registration || registration.user.toString() !== req.userId) {
            return res.json({success: false, message: "Registration not found"});
        }
        
        if (registration.status === 'Dropped') {
            return res.json({success: false, message: "Course is already dropped"});
        }

        const course = await Course.findById(registration.course);
        if (course && course.isFrozen) {
            return res.json({success: false, message: "Course is frozen by admin, cannot drop"});
        }

        // Update status to Dropped
        registration.status = 'Dropped';
        await registration.save();

        // Decrement course enrolled count
        if (course && course.enrolledCount > 0) {
            course.enrolledCount -= 1;
            await course.save();
        }

        res.json({success: true, message: "Course dropped successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


// --- ADMIN ACTIONS ---

export const addCourse = async (req, res) => {
    try {
        const { title, code, instructor, credits, capacity } = req.body;
        await Course.create({ title, code, instructor, credits, capacity });
        res.json({success: true, message: "Course added to catalog successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const removeCourse = async (req, res) => {
    try {
        const { id, password } = req.body;
        if (password !== process.env.ADMIN_PASSWORD) {
            return res.json({success: false, message: "Incorrect admin password"});
        }
        await Course.findByIdAndDelete(id);
        // Note: In a real system, you might want to handle existing registrations (e.g. notify students)
        res.json({success: true, message: "Course removed from catalog"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const toggleFreezeCourse = async (req, res) => {
    try {
        const { id, password } = req.body;
        if (password !== process.env.ADMIN_PASSWORD) {
            return res.json({success: false, message: "Incorrect admin password"});
        }
        const course = await Course.findById(id);
        if (!course) return res.json({success: false, message: "Course not found"});
        
        course.isFrozen = !course.isFrozen;
        await course.save();
        
        res.json({success: true, message: `Course ${course.isFrozen ? 'frozen' : 'unfrozen'} successfully`});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}
