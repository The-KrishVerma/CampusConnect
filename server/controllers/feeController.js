import FeePayment from '../models/FeePayment.js';
import crypto from 'crypto';

export const initiatePayment = async (req, res) => {
    try {
        const {amount, description} = req.body;
        if (!amount || !description) {
            return res.json({success: false, message: "Missing required fields"});
        }

        // Simulate payment gateway
        const transactionId = 'TXN' + crypto.randomBytes(8).toString('hex').toUpperCase();

        await FeePayment.create({
            user: req.userId,
            amount,
            description,
            transactionId,
            paymentDate: new Date(),
            status: 'Paid'
        });

        res.json({success: true, message: "Fee payment successful", transactionId});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getMyPayments = async (req, res) => {
    try {
        const payments = await FeePayment.find({user: req.userId}).sort({createdAt: -1});
        res.json({success: true, payments});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getAllPaymentsAdmin = async (req, res) => {
    try {
        const payments = await FeePayment.find({}).populate('user', 'name email').sort({createdAt: -1});
        res.json({success: true, payments});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const addPendingFeeAdmin = async (req, res) => {
    try {
        const {userId, amount, description} = req.body;
        await FeePayment.create({
            user: userId,
            amount,
            description,
            status: 'Pending'
        });
        res.json({success: true, message: "Fee assigned successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}
