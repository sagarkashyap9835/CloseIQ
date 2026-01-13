import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
let client = null;

if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
    console.log("✓ Twilio SMS client initialized");
} else {
    console.warn("⚠ Twilio credentials not configured. SMS will be simulated.");
}

// Generate 6-digit OTP
export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Twilio SMS
export const sendOtpSms = async (phone, otp) => {
    const formattedPhone = `+91${phone}`;
    const message = `Your CloseIQ verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`;

    // If Twilio is not configured, simulate SMS
    if (!client) {
        console.log(`📱 [SIMULATED SMS] To: ${formattedPhone}`);
        console.log(`📱 [SIMULATED SMS] Message: ${message}`);
        return {
            success: true,
            simulated: true,
            message: "SMS simulated (Twilio not configured)"
        };
    }

    try {
        const result = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: formattedPhone
        });

        console.log(`✓ SMS sent successfully. SID: ${result.sid}`);

        return {
            success: true,
            simulated: false,
            sid: result.sid,
            message: "SMS sent successfully"
        };
    } catch (error) {
        console.error("✗ SMS sending failed:", error.message);

        return {
            success: false,
            simulated: false,
            error: error.message,
            message: "Failed to send SMS"
        };
    }
};

export default { generateOtp, sendOtpSms };
