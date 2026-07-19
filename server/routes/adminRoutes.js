import express from 'express'
import {adminLogin, approveCommentById, deleteCommentById, getAllAnnouncementsAdmin, getAllComments, getDashboard} from '../controllers/adminController.js';
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/comments", adminAuth, getAllComments);
adminRouter.get("/announcements", adminAuth, getAllAnnouncementsAdmin);
adminRouter.post("/delete-comment", adminAuth, deleteCommentById);
adminRouter.post("/approve-comment", adminAuth, approveCommentById);
adminRouter.get("/dashboard", adminAuth, getDashboard);


export default adminRouter;
