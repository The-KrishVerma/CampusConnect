import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendMail } from "../configs/mailer.js";
import { verificationEmail, resetPasswordEmail } from "../configs/emailTemplates.js";
import imagekit from "../configs/imageKit.js";
import fs from "fs";

const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const hashBuffer = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');
    if (hashBuffer.length !== keyBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, keyBuffer);
};

const signToken = (user, role = 'user') => {
    return jwt.sign(
        {id: user._id, role},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    );
};

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOtp = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};

const setOtp = async (user) => {
    const otp = generateOtp();
    user.otpHash = hashOtp(otp);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    return otp;
};

const setResetOtp = async (user) => {
    const otp = generateOtp();
    user.resetOtpHash = hashOtp(otp);
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    return otp;
};

export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if (!name || !email || !password) {
            return res.json({success: false, message: "Missing required fields"});
        }

        const normalizedEmail = email.toLowerCase().trim();
        let user = await User.findOne({email: normalizedEmail});
        if (user && user.isVerified) {
            return res.json({success: false, message: "Email already registered"});
        }

        if (!user) {
            const passwordHash = hashPassword(password);
            user = await User.create({name, email: normalizedEmail, passwordHash});
        } else {
            user.name = name;
            user.passwordHash = hashPassword(password);
            await user.save();
        }

        const otp = await setOtp(user);
        const html = verificationEmail({name: user.name, code: otp});
        await sendMail({
            to: user.email,
            subject: 'Verify your email',
            html,
        });

        res.json({
            success: true,
            message: 'Verification code sent to your email',
            verificationRequired: true,
            email: user.email,
        });
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const {email, otp} = req.body;
        if (!email || !otp) {
            return res.json({success: false, message: "Missing required fields"});
        }
        const user = await User.findOne({email: email.toLowerCase().trim()});
        if (!user) {
            return res.json({success: false, message: "Invalid code"});
        }
        if (!user.otpHash || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            return res.json({success: false, message: "Code expired"});
        }
        if (hashOtp(otp) !== user.otpHash) {
            return res.json({success: false, message: "Invalid code"});
        }
        user.isVerified = true;
        user.otpHash = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        const token = signToken(user, 'user');
        res.json({
            success: true,
            token,
            role: 'user',
            user: {id: user._id, name: user.name, email: user.email},
        });
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

export const resendOtp = async (req, res) => {
    try {
        const {email} = req.body;
        if (!email) {
            return res.json({success: false, message: "Email is required"});
        }
        const user = await User.findOne({email: email.toLowerCase().trim()});
        if (!user) {
            return res.json({success: true, message: "If the email exists, a new code was sent"});
        }
        if (user.isVerified) {
            return res.json({success: false, message: "Email already verified"});
        }
        const otp = await setOtp(user);
        const html = verificationEmail({name: user.name, code: otp});
        await sendMail({
            to: user.email,
            subject: 'Your new verification code',
            html,
        });
        res.json({success: true, message: "Verification code sent"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.json({success: false, message: "Missing required fields"});
        }

        // Admin check
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({email, role: 'admin'}, process.env.JWT_SECRET, {expiresIn: '7d'});
            return res.json({
                success: true,
                token,
                role: 'admin',
                user: { id: 'admin', name: 'Admin', email }
            });
        }

        const user = await User.findOne({email: email.toLowerCase().trim()});
        if (!user || !verifyPassword(password, user.passwordHash)) {
            return res.json({success: false, message: "Invalid credentials"});
        }
        if (!user.isVerified) {
            return res.json({success: false, message: "Email not verified"});
        }

        const token = signToken(user, 'user');
        res.json({
            success: true,
            token,
            role: 'user',
            user: {id: user._id, name: user.name, email: user.email},
        });
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

export const requestPasswordReset = async (req, res) => {
    try {
        const {email} = req.body;
        if (!email) {
            return res.json({success: false, message: "Email is required"});
        }
        const user = await User.findOne({email: email.toLowerCase().trim()});
        if (!user) {
            return res.json({success: true, message: "If the email exists, a reset code was sent"});
        }
        const otp = await setResetOtp(user);
        const html = resetPasswordEmail({name: user.name, code: otp});
        await sendMail({
            to: user.email,
            subject: 'Reset your password',
            html,
        });
        res.json({success: true, message: "Reset code sent"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

export const resetPassword = async (req, res) => {
    try {
        const {email, otp, newPassword} = req.body;
        if (!email || !otp || !newPassword) {
            return res.json({success: false, message: "Missing required fields"});
        }
        const user = await User.findOne({email: email.toLowerCase().trim()});
        if (!user || !user.resetOtpHash || !user.resetOtpExpiresAt) {
            return res.json({success: false, message: "Invalid reset code"});
        }
        if (user.resetOtpExpiresAt < new Date()) {
            return res.json({success: false, message: "Reset code expired"});
        }
        if (hashOtp(otp) !== user.resetOtpHash) {
            return res.json({success: false, message: "Invalid reset code"});
        }

        user.passwordHash = hashPassword(newPassword);
        user.resetOtpHash = undefined;
        user.resetOtpExpiresAt = undefined;
        await user.save();
        res.json({success: true, message: "Password updated"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('name email avatar bio');
        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }
        res.json({success: true, user});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {name, bio, avatarUrl} = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        if (name) user.name = name;
        if (typeof bio === 'string') user.bio = bio;

        if (avatarUrl) {
            user.avatar = avatarUrl;
        }

        if (req.file) {
            const fileBuffer = fs.readFileSync(req.file.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: req.file.originalname,
                folder: "/avatars"
            });
            const optimizedImageUrl = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '512'}
                ]
            });
            user.avatar = optimizedImageUrl;
        }

        await user.save();
        res.json({success: true, user: {id: user._id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio}});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};
