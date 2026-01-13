import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ["login", "register"],
        default: "login"
    },
    attempts: {
        type: Number,
        default: 0,
        max: 5
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Auto-delete when expired
    }
}, {
    timestamps: true
});

// Index for faster queries
otpSchema.index({ phone: 1, otp: 1 });

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
