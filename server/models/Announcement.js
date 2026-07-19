import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    title: {type: String, required: true},
    subTitle: {type: String},
    description: {type: String, required: true},

    image: {type: String, required: true},
    isPublished: {type: Boolean, required: true},
    isPinned: {type: Boolean, default: false},
}, {timestamps: true});

const Announcement = mongoose.model('announcement', announcementSchema);

export default Announcement;