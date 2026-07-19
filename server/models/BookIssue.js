import mongoose from "mongoose";

const bookIssueSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    bookTitle: {type: String, required: true},
    bookCode: {type: String, required: true},
    author: {type: String, required: true},
    issueDate: {type: Date},
    expectedReturnDate: {type: Date},
    status: {type: String, enum: ['Requested', 'Issued', 'Returned', 'Rejected'], default: 'Requested'},
}, {timestamps: true});

const BookIssue = mongoose.model('BookIssue', bookIssueSchema);

export default BookIssue;
