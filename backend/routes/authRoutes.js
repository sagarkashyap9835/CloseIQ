import express from "express";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { generateOtp, sendOtpSms } from "../config/twilio.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiting for OTP requests (max 5 per 15 minutes per IP)
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { success: false, message: "Too many OTP requests. Please try again later." }
});

// Cloudinary storage for profile images
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "closeiq-profiles",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }]
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ==========================================
// CHECK IF PHONE EXISTS (for login vs register flow)
// ==========================================
router.post("/check-phone", async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit Indian mobile number"
            });
        }

        const existingUser = await User.findOne({ phone });

        res.json({
            success: true,
            exists: !!existingUser,
            message: existingUser ? "User exists. Please login." : "New user. Please register."
        });
    } catch (error) {
        console.error("Check phone error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ==========================================
// SEND OTP
// ==========================================
router.post("/send-otp", otpLimiter, async (req, res) => {
    try {
        const { phone, purpose = "login" } = req.body;

        // Validate phone
        if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit Indian mobile number"
            });
        }

        // Check if user exists for login purpose
        const existingUser = await User.findOne({ phone });

        if (purpose === "login" && !existingUser) {
            return res.status(400).json({
                success: false,
                message: "No account found with this number. Please register first.",
                needsRegistration: true
            });
        }

        if (purpose === "register" && existingUser) {
            return res.status(400).json({
                success: false,
                message: "This number is already registered. Please login instead.",
                alreadyRegistered: true
            });
        }

        // Delete any existing OTPs for this phone
        await Otp.deleteMany({ phone });

        // Generate new OTP
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP to database
        await Otp.create({
            phone,
            otp,
            purpose,
            expiresAt
        });

        // Send OTP via SMS
        const smsResult = await sendOtpSms(phone, otp);

        res.json({
            success: true,
            message: smsResult.simulated
                ? `OTP sent (Demo mode): ${otp}`
                : "OTP sent to your mobile number",
            expiresIn: 300, // 5 minutes in seconds
            simulated: smsResult.simulated
        });
    } catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
});

// ==========================================
// VERIFY OTP & LOGIN
// ==========================================
router.post("/verify-otp", async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Phone and OTP are required"
            });
        }

        // Find valid OTP
        const otpRecord = await Otp.findOne({
            phone,
            otp,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            // Increment attempts for this phone's OTPs
            await Otp.updateMany(
                { phone, isUsed: false },
                { $inc: { attempts: 1 } }
            );

            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP. Please try again."
            });
        }

        // Check max attempts
        if (otpRecord.attempts >= 5) {
            await Otp.deleteMany({ phone });
            return res.status(400).json({
                success: false,
                message: "Maximum attempts exceeded. Please request a new OTP."
            });
        }

        // Mark OTP as used
        otpRecord.isUsed = true;
        await otpRecord.save();

        // Find or indicate user needs registration
        const user = await User.findOne({ phone });

        if (user) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();

            res.json({
                success: true,
                message: "Login successful",
                isNewUser: false,
                user: {
                    id: user._id,
                    phone: user.phone,
                    name: user.name,
                    email: user.email,
                    gender: user.gender,
                    street: user.street,
                    pincode: user.pincode,
                    state: user.state,
                    country: user.country,
                    location: user.location,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt
                }
            });
        } else {
            // New user - needs registration
            res.json({
                success: true,
                message: "OTP verified. Please complete registration.",
                isNewUser: true,
                phone
            });
        }
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ success: false, message: "Verification failed" });
    }
});

// ==========================================
// REGISTER NEW USER
// ==========================================
router.post("/register", async (req, res) => {
    try {
        const { phone, name, email } = req.body;

        if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Valid phone number is required"
            });
        }

        if (!name || name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Name is required (minimum 2 characters)"
            });
        }

        // Check if already registered
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "This number is already registered. Please login instead.",
                alreadyRegistered: true
            });
        }

        // Create new user
        const user = await User.create({
            phone,
            name: name.trim(),
            email: email?.trim() || "",
            isVerified: true,
            lastLogin: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                phone: user.phone,
                name: user.name,
                email: user.email,
                gender: user.gender,
                street: user.street,
                pincode: user.pincode,
                state: user.state,
                country: user.country,
                location: user.location,
                profileImage: user.profileImage,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Register error:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "This phone number is already registered"
            });
        }
        res.status(500).json({ success: false, message: "Registration failed" });
    }
});

// ==========================================
// UPDATE PROFILE
// ==========================================
router.put("/profile/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, gender, street, pincode, state, country, location } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update fields
        if (name !== undefined) user.name = name.trim();
        if (email !== undefined) user.email = email.trim();
        if (gender !== undefined) user.gender = gender;
        if (street !== undefined) user.street = street.trim();
        if (pincode !== undefined) user.pincode = pincode.trim();
        if (state !== undefined) user.state = state.trim();
        if (country !== undefined) user.country = country.trim();
        if (location !== undefined) user.location = location.trim();

        await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                phone: user.phone,
                name: user.name,
                email: user.email,
                gender: user.gender,
                street: user.street,
                pincode: user.pincode,
                state: user.state,
                country: user.country,
                location: user.location,
                profileImage: user.profileImage,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
});

// ==========================================
// UPLOAD PROFILE IMAGE
// ==========================================
router.post("/profile/:userId/image", upload.single("profileImage"), async (req, res) => {
    try {
        const { userId } = req.params;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Delete old image from Cloudinary if exists
        if (user.profileImage) {
            try {
                const publicId = user.profileImage.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`closeiq-profiles/${publicId}`);
            } catch (e) {
                console.log("Could not delete old image:", e.message);
            }
        }

        // Update with new image URL
        user.profileImage = req.file.path;
        await user.save();

        res.json({
            success: true,
            message: "Profile image updated",
            profileImage: user.profileImage
        });
    } catch (error) {
        console.error("Upload image error:", error);
        res.status(500).json({ success: false, message: "Failed to upload image" });
    }
});

// ==========================================
// GET USER PROFILE
// ==========================================
router.get("/profile/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                phone: user.phone,
                name: user.name,
                email: user.email,
                gender: user.gender,
                street: user.street,
                pincode: user.pincode,
                state: user.state,
                country: user.country,
                location: user.location,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ success: false, message: "Failed to get profile" });
    }
});

// ==========================================
// ADMIN: GET ALL USERS
// ==========================================
router.get("/admin/users", async (req, res) => {
    try {
        const { page = 1, limit = 20, search = "" } = req.query;

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select("-__v")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            users: users.map(u => ({
                id: u._id,
                phone: u.phone,
                name: u.name,
                email: u.email,
                gender: u.gender,
                location: u.location,
                state: u.state,
                country: u.country,
                profileImage: u.profileImage,
                isActive: u.isActive,
                createdAt: u.createdAt,
                lastLogin: u.lastLogin
            }))
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ success: false, message: "Failed to get users" });
    }
});

// ==========================================
// ADMIN: GET USER STATS
// ==========================================
router.get("/admin/stats", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const verifiedUsers = await User.countDocuments({ isVerified: true });

        // Users registered today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayUsers = await User.countDocuments({
            createdAt: { $gte: today }
        });

        // Users registered this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekUsers = await User.countDocuments({
            createdAt: { $gte: weekAgo }
        });

        // Users registered this month
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const monthUsers = await User.countDocuments({
            createdAt: { $gte: monthAgo }
        });

        res.json({
            success: true,
            stats: {
                totalUsers,
                activeUsers,
                verifiedUsers,
                todayUsers,
                weekUsers,
                monthUsers
            }
        });
    } catch (error) {
        console.error("Get stats error:", error);
        res.status(500).json({ success: false, message: "Failed to get stats" });
    }
});

export default router;
