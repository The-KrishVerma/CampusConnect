import express from "express";
import { addAnnouncement, getAllAnnouncements, deleteAnnouncementById, getAnnouncementById, generateContent, togglePublish, togglePin, getAnnouncementComments, addComment, updateAnnouncementById } from "../controllers/announcementController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";


const announcementRouter = express.Router();

announcementRouter.post("/add", upload.single('image'), adminAuth, addAnnouncement);
announcementRouter.post("/update", upload.single('image'), adminAuth, updateAnnouncementById);
announcementRouter.get('/all', getAllAnnouncements);
announcementRouter.post('/delete', adminAuth, deleteAnnouncementById);
announcementRouter.post('/toggle-publish', adminAuth, togglePublish);
announcementRouter.post('/toggle-pin', adminAuth, togglePin);
announcementRouter.post('/add-comment', addComment);
announcementRouter.post('/comments', getAnnouncementComments);
announcementRouter.post('/generate', adminAuth, generateContent);
announcementRouter.get('/:announcementId', getAnnouncementById);



export default announcementRouter;
