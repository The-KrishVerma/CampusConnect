import Booking from '../models/Booking.js';

export const submitBooking = async (req, res) => {
    try {
        const {guestName, accommodationType, checkInDate, checkOutDate} = req.body;
        if (!guestName || !accommodationType || !checkInDate || !checkOutDate) {
            return res.json({success: false, message: "Missing required fields"});
        }

        // Validation: Check for overlapping approved bookings
        const existingBookings = await Booking.find({
            status: 'Approved',
            $or: [
                { checkInDate: { $lte: checkOutDate }, checkOutDate: { $gte: checkInDate } }
            ]
        });

        if (existingBookings.length > 0) {
            return res.json({success: false, message: "Selected dates are already booked"});
        }

        await Booking.create({
            user: req.userId,
            guestName,
            accommodationType,
            checkInDate,
            checkOutDate
        });

        res.json({success: true, message: "Booking requested successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({user: req.userId}).sort({createdAt: -1});
        res.json({success: true, bookings});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getAllBookingsAdmin = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'name email').sort({createdAt: -1});
        res.json({success: true, bookings});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const updateBookingStatus = async (req, res) => {
    try {
        const {id, status} = req.body;
        await Booking.findByIdAndUpdate(id, {status});
        res.json({success: true, message: "Booking status updated"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getBookedDates = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'Approved' }, 'checkInDate checkOutDate');
        let bookedDates = [];
        
        bookings.forEach(booking => {
            let currentDate = new Date(booking.checkInDate);
            const endDate = new Date(booking.checkOutDate);
            
            while (currentDate <= endDate) {
                bookedDates.push(new Date(currentDate).toISOString());
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        res.json({success: true, bookedDates});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}
