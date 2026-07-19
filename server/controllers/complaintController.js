import Complaint from '../models/Complaint.js';

export const submitComplaint = async (req, res) => {
    try {
        const {title, description, category} = req.body;
        if (!title || !description || !category) {
            return res.json({success: false, message: "Missing required fields"});
        }

        await Complaint.create({
            user: req.userId,
            title,
            description,
            category
        });

        res.json({success: true, message: "Complaint registered successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({user: req.userId}).sort({createdAt: -1});
        res.json({success: true, complaints});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getAllComplaintsAdmin = async (req, res) => {
    try {
        const complaints = await Complaint.find({}).populate('user', 'name email').sort({createdAt: -1});
        res.json({success: true, complaints});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const updateComplaintStatus = async (req, res) => {
    try {
        const {id, status} = req.body;
        await Complaint.findByIdAndUpdate(id, {status});
        res.json({success: true, message: "Complaint status updated"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}
