import mongoose from "mongoose";

const feePaymentSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: {type: Number, required: true},
    description: {type: String, required: true},
    transactionId: {type: String},
    paymentDate: {type: Date},
    status: {type: String, enum: ['Pending', 'Paid'], default: 'Pending'},
}, {timestamps: true});

const FeePayment = mongoose.model('FeePayment', feePaymentSchema);

export default FeePayment;
