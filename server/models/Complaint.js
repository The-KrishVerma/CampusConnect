import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    status: {type: String, enum: ['Pending', 'Resolved', 'Rejected'], default: 'Pending'},
}, {timestamps: true});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
