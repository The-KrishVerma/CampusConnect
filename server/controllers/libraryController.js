import BookIssue from '../models/BookIssue.js';

export const submitBookRequest = async (req, res) => {
    try {
        const {bookTitle, bookCode, author} = req.body;
        if (!bookTitle || !bookCode || !author) {
            return res.json({success: false, message: "Missing required fields"});
        }

        await BookIssue.create({
            user: req.userId,
            bookTitle,
            bookCode,
            author
        });

        res.json({success: true, message: "Book requested successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getMyLibraryRequests = async (req, res) => {
    try {
        const requests = await BookIssue.find({user: req.userId}).sort({createdAt: -1});
        res.json({success: true, requests});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getAllLibraryRequestsAdmin = async (req, res) => {
    try {
        const requests = await BookIssue.find({}).populate('user', 'name email').sort({createdAt: -1});
        res.json({success: true, requests});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const updateBookStatus = async (req, res) => {
    try {
        const {id, status, expectedReturnDate} = req.body;
        const updateData = {status};
        
        if (status === 'Issued') {
            updateData.issueDate = new Date();
            if (expectedReturnDate) updateData.expectedReturnDate = expectedReturnDate;
        }

        await BookIssue.findByIdAndUpdate(id, updateData);
        res.json({success: true, message: "Book status updated"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}
