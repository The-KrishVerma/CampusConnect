import jwt from 'jsonwebtoken'
import Announcement from '../models/Announcement.js';
import Comment from '../models/Comment.js';


export const adminLogin = async(req, res) => {
    try {
        const {email, password} = req.body;

        if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({success: false, message: "Invalid Credentials"})
        }

        const token = jwt.sign({email, role: 'admin'}, process.env.JWT_SECRET, {expiresIn: '7d'})
        return res.json({success: true, token, role: 'admin'})
    }catch(error) {
        res.json({success: false, message: error.message})
    }
}

export const getAllAnnouncementsAdmin = async(req, res) => {
    try {
        const announcements = await Announcement.find({}).sort({createdAt: -1});
        res.json({success: true, announcements})
    }catch(error) { 
        res.json({success: false, message: error.message})
    }
}

export const getAllComments = async(req, res) => {
    try {
        const comments = await Comment.find({}).populate("announcement").sort({createdAt: -1});
        res.json({success: true, comments})
    }catch(error) { 
        res.json({success: false, message: error.message})
    }
}

export const getDashboard = async(req, res) => {
    try {
        const recentAnnouncements = await Announcement.find({}).sort({createdAt: -1}).limit(5);
        const announcements = await Announcement.countDocuments();
        const comments = await Comment.countDocuments()
        const pendingComments = await Comment.countDocuments({isApproved: false})
        const drafts = await Announcement.countDocuments({isPublished: false})

        const dashboardData = {
            announcements, comments, drafts, recentAnnouncements, pendingComments
        }

        res.json({success: true, dashboardData})
    }catch(error) { 
        res.json({success: false, message: error.message})
    }
}

export const deleteCommentById = async(req, res) => {
    try {
        const {id} = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({success: true, message: "Comment deleted successfully"})
    } catch(error){
        res.json({success: false, message: error.message})
    }
}

export const approveCommentById = async(req, res) => {
    try {
        const {id} = req.body;
        await Comment.findByIdAndUpdate(id, {isApproved: true});
        res.json({success: true, message: "Comment approved successfully"})
    } catch(error) { 
        res.json({success: false, message: error.message})
    }
}
