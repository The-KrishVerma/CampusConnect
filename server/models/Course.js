import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    code: {type: String, required: true, unique: true},
    instructor: {type: String, required: true},
    credits: {type: Number, required: true},
    capacity: {type: Number, required: true, default: 50},
    enrolledCount: {type: Number, default: 0},
    isFrozen: {type: Boolean, default: false}
}, {timestamps: true});

const Course = mongoose.model('Course', courseSchema);

export default Course;
