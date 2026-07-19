import fs from 'fs'
import imagekit from '../configs/imageKit.js';
import Announcement from '../models/Announcement.js';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js'

export const addAnnouncement = async (req, res) => {
    try {
        const{title, subTitle, description, isPublished} = JSON.parse
        (req.body.announcement);
        const imageFile = req.file;

        if(!title || !description || !imageFile) {
            return res.json({success: false, message: "Missing required fields" })
        }

        const fileBuffer = fs.readFileSync(imageFile.path)

        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/announcements"
        })

        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: 'auto'},
                {format: 'webp'},
                {width: '1280'}
            ]
        });

        const image = optimizedImageUrl;
        await Announcement.create({title, subTitle, description, image, isPublished})

        res.json({success: true, message: "Announcement added successfully"})

    } catch (error) {
        res.json({success: false, message: error.message})
        
    }
}

export const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({isPublished: true})
        res.json({success: true, announcements})
    }catch (error) {
        res.json({success:false, message: error.message})
    }
}

export const getAnnouncementById = async (req,res) => {
    try {
        const {announcementId} = req.params;
        const announcement = await Announcement.findById(announcementId)
        if(!announcement) {
            return res.json({ success: false, message: "Announcement not found" })
        }
        res.json({success: true, announcement})
    } catch(error) {
        return res.json({ success: false, message: error.message })

    }
}

export const deleteAnnouncementById = async (req,res) => {
    try {
        const {id} = req.body;
        await Announcement.findByIdAndDelete(id);
        await Comment.deleteMany({announcement: id});
        res.json({ success: true, message: "Announcement deleted successfully" })
    } catch(error) {
        res.json({ success: false, message: error.message })
    }
}
export const togglePublish = async (req, res) => {
    try {
        const {id}= req.body;
        const announcement = await Announcement.findById(id);
        announcement.isPublished = !announcement.isPublished;
        await announcement.save();
        res.json({success: true, message: 'Announcement status updated'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const togglePin = async (req, res) => {
    try {
        const {id} = req.body;
        const announcement = await Announcement.findById(id);
        announcement.isPinned = !announcement.isPinned;
        await announcement.save();
        res.json({success: true, message: announcement.isPinned ? 'Announcement Pinned' : 'Announcement Unpinned'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const updateAnnouncementById = async (req, res) => {
    try {
        const {id, title, subTitle, description, isPublished} = req.body;
        const update = {};
        if (title) update.title = title;
        if (subTitle !== undefined) update.subTitle = subTitle;
        if (description) update.description = description;

        if (isPublished !== undefined) {
            update.isPublished = typeof isPublished === 'boolean'
                ? isPublished
                : String(isPublished).toLowerCase() === 'true';
        }

        if (req.file) {
            const fileBuffer = fs.readFileSync(req.file.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: req.file.originalname,
                folder: "/announcements"
            });
            const optimizedImageUrl = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '1280'}
                ]
            });
            update.image = optimizedImageUrl;
        }

        const announcement = await Announcement.findByIdAndUpdate(id, update, {new: true});
        if (!announcement) {
            return res.json({success: false, message: "Announcement not found"});
        }
        res.json({success: true, message: "Announcement updated", announcement});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const addComment = async(req, res) => {
    try {
        const{announcement, name, content}= req.body;
        await Comment.create({announcement, name, content});
        res.json({success: true, message: 'Comment added for review'})
    } catch(error) {
        res.json({success: false, message: error.message})
    }
}

export const getAnnouncementComments = async(req, res) => {
    try {
        const{announcementId} = req.body;
        const comments = await Comment.find({announcement: announcementId, isApproved: true}).sort({createdAt: -1});
        res.json({success: true, comments})
    } catch(error) {
        res.json({success: false, message: error.message})
    }
}

export const generateContent = async (req,res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.json({success: false, message: 'Gemini API key is missing in environment variables.'});
        }
        const {prompt} = req.body;
        const content = await main(`${prompt}. Generate a announcement content for this topic in simple text format.`)
        res.json({success: true, content})
    } catch (error) { 
        // Provide a clear message when API quota is exhausted or rate-limited
        const msg = (error && (error.message || '')).toString().toLowerCase();
        if (msg.includes('quota') || msg.includes('resource_exhausted') || msg.includes('rate') || msg.includes('429')) {
            return res.json({success: false, message: 'AI quota exceeded — please check your Gemini API billing/quota or try again later.'})
        }

        res.json({success: false, message: error.message})
        
    }
}
