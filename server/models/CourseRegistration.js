import mongoose from "mongoose";

const courseRegistrationSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
    semester: {type: String, required: true, default: 'Fall 2026'},
    status: {type: String, enum: ['Registered', 'Dropped'], default: 'Registered'},
}, {timestamps: true});

const CourseRegistration = mongoose.model('CourseRegistration', courseRegistrationSchema);

export default CourseRegistration;
