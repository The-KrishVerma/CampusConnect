import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    guestName: {type: String, required: true},
    accommodationType: {type: String, enum: ['Visitor Hostel', 'Hotel'], required: true},
    checkInDate: {type: Date, required: true},
    checkOutDate: {type: Date, required: true},
    status: {type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending'},
}, {timestamps: true});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
