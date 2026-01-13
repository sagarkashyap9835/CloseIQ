import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { user, isAuthenticated, loading, register, login, logout, updateProfile, checkPhoneExists } = useAuth();

    // Auth states
    const [authMode, setAuthMode] = useState("phone"); // phone, otp, register
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [isNewUser, setIsNewUser] = useState(false);
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [error, setError] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    // Profile edit states
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    const otpInputs = useRef([]);
    const fileInputRef = useRef(null);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Initialize edit data when user changes
    useEffect(() => {
        if (user) {
            setEditData({
                name: user.name || "",
                email: user.email || "",
                street: user.street || "",
                pincode: user.pincode || "",
                state: user.state || "",
                country: user.country || "India",
                gender: user.gender || "",
                location: user.location || "",
            });
            setImagePreview(user.profileImage);
        }
    }, [user]);

    // Generate random 6-digit OTP
    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Handle phone submit
    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!/^[6-9]\d{9}$/.test(phone)) {
            setError("Please enter a valid 10-digit Indian mobile number");
            return;
        }

        const exists = checkPhoneExists(phone);
        setIsNewUser(!exists);

        const newOtp = generateOtp();
        setGeneratedOtp(newOtp);
        setOtpSent(true);
        setResendTimer(30);
        setAuthMode("otp");

        // Simulate OTP sent - In production, this would be an API call
        console.log("OTP Generated:", newOtp);
        alert(`Your OTP is: ${newOtp} (In production, this will be sent via SMS)`);
    };

    // Handle OTP input
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpInputs.current[index + 1]?.focus();
        }
    };

    // Handle OTP key down (for backspace)
    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpInputs.current[index - 1]?.focus();
        }
    };

    // Verify OTP
    const handleOtpVerify = (e) => {
        e.preventDefault();
        setError("");

        const enteredOtp = otp.join("");

        if (enteredOtp.length !== 6) {
            setError("Please enter complete 6-digit OTP");
            return;
        }

        if (enteredOtp !== generatedOtp) {
            setError("Invalid OTP. Please try again.");
            return;
        }

        if (isNewUser) {
            setAuthMode("register");
        } else {
            login(phone);
        }
    };

    // Handle registration
    const handleRegister = (e) => {
        e.preventDefault();
        setError("");

        if (!registerName.trim()) {
            setError("Please enter your name");
            return;
        }

        register({
            phone,
            name: registerName,
            email: registerEmail,
        });
    };

    // Resend OTP
    const handleResendOtp = () => {
        if (resendTimer > 0) return;

        const newOtp = generateOtp();
        setGeneratedOtp(newOtp);
        setResendTimer(30);
        setOtp(["", "", "", "", "", ""]);

        console.log("New OTP Generated:", newOtp);
        alert(`Your new OTP is: ${newOtp}`);
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Save profile changes
    const handleSaveProfile = () => {
        updateProfile({
            ...editData,
            profileImage: imagePreview,
        });
        setIsEditing(false);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditData({
            name: user?.name || "",
            email: user?.email || "",
            street: user?.street || "",
            pincode: user?.pincode || "",
            state: user?.state || "",
            country: user?.country || "India",
            gender: user?.gender || "",
            location: user?.location || "",
        });
        setImagePreview(user?.profileImage);
        setIsEditing(false);
    };

    // Reset auth flow
    const resetAuth = () => {
        setAuthMode("phone");
        setPhone("");
        setOtp(["", "", "", "", "", ""]);
        setGeneratedOtp("");
        setOtpSent(false);
        setIsNewUser(false);
        setRegisterName("");
        setRegisterEmail("");
        setError("");
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    // ========== AUTHENTICATED VIEW ==========
    if (isAuthenticated && user) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="max-w-2xl mx-auto">
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
                        {/* Cover gradient */}
                        <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 relative">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
                        </div>

                        {/* Profile Image & Info */}
                        <div className="relative px-6 pb-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
                                {/* Profile Image */}
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-16 h-16 text-emerald-300" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                                        >
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>

                                {/* Name & Phone */}
                                <div className="flex-1 text-center sm:text-left pb-2">
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        {user.name || "Add your name"}
                                    </h1>
                                    <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                        </svg>
                                        +91 {user.phone}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {!isEditing ? (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={logout}
                                                className="px-5 py-2.5 border-2 border-red-200 text-red-500 rounded-xl font-medium hover:bg-red-50 transition-all duration-300 flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-5 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Profile Details Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </span>
                            Personal Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-300"
                                        placeholder="Enter your name"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                                        {user.name || <span className="text-gray-400">Not set</span>}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-300"
                                        placeholder="Enter your email"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                                        {user.email || <span className="text-gray-400">Not set</span>}
                                    </p>
                                )}
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Gender</label>
                                {isEditing ? (
                                    <select
                                        value={editData.gender}
                                        onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-300 bg-white"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                ) : (
                                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 capitalize">
                                        {user.gender || <span className="text-gray-400">Not set</span>}
                                    </p>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Location</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.location}
                                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-300"
                                        placeholder="Enter your location"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                                        {user.location || <span className="text-gray-400">Not set</span>}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                </span>
                                Address
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Street */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-600">Street Address</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.street}
                                            onChange={(e) => setEditData({ ...editData, street: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-300"
                                            placeholder="Enter your street address"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                                            {user.street || <span className="text-gray-400">Not set</span>}
                                        </p>
                                    )}
                                </div>

                                {/* Pincode */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Pincode</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.pincode}
                                            onChange={(e) => setEditData({ ...editData, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-300"
                                            placeholder="Enter pincode"
                                            maxLength={6}
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                                            {user.pincode || <span className="text-gray-400">Not set</span>}
                                        </p>
                                    )}
                                </div>

                                {/* State */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">State</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.state}
                                            onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-300"
                                            placeholder="Enter state"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                                            {user.state || <span className="text-gray-400">Not set</span>}
                                        </p>
                                    )}
                                </div>

                                {/* Country */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Country</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.country}
                                            onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-300"
                                            placeholder="Enter country"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                                            {user.country || <span className="text-gray-400">Not set</span>}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ========== AUTH VIEW ==========
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <div className="w-full max-w-md">
                {/* Auth Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-200 to-emerald-200 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50"></div>

                    <div className="relative">
                        {/* Logo/Icon */}
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                            {authMode === "phone" && "Welcome to ClosetIQ"}
                            {authMode === "otp" && "Verify OTP"}
                            {authMode === "register" && "Complete Your Profile"}
                        </h1>
                        <p className="text-gray-500 text-center mb-8">
                            {authMode === "phone" && "Login or Register with your phone number"}
                            {authMode === "otp" && `We've sent a verification code to +91 ${phone}`}
                            {authMode === "register" && "Just a few more details to get started"}
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-shake">
                                {error}
                            </div>
                        )}

                        {/* Phone Input Form */}
                        {authMode === "phone" && (
                            <form onSubmit={handlePhoneSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Phone Number</label>
                                    <div className="flex gap-2">
                                        <div className="flex items-center px-4 py-3 bg-gray-100 rounded-xl text-gray-600 font-medium">
                                            +91
                                        </div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                            className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-300 text-lg tracking-wider"
                                            placeholder="9876543210"
                                            maxLength={10}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Get OTP
                                </button>
                            </form>
                        )}

                        {/* OTP Input Form */}
                        {authMode === "otp" && (
                            <form onSubmit={handleOtpVerify} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Enter 6-digit OTP</label>
                                    <div className="flex gap-2 justify-center">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => (otpInputs.current[index] = el)}
                                                type="text"
                                                inputMode="numeric"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-300"
                                                maxLength={1}
                                                autoFocus={index === 0}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Verify OTP
                                </button>

                                <div className="flex items-center justify-between text-sm">
                                    <button
                                        type="button"
                                        onClick={resetAuth}
                                        className="text-gray-500 hover:text-emerald-600 transition-colors"
                                    >
                                        ← Change Number
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendTimer > 0}
                                        className={`transition-colors ${resendTimer > 0 ? "text-gray-400 cursor-not-allowed" : "text-emerald-600 hover:text-emerald-700"}`}
                                    >
                                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Register Form */}
                        {authMode === "register" && (
                            <form onSubmit={handleRegister} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Full Name *</label>
                                    <input
                                        type="text"
                                        value={registerName}
                                        onChange={(e) => setRegisterName(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-300"
                                        placeholder="Enter your name"
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Email (Optional)</label>
                                    <input
                                        type="email"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-300"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Complete Registration
                                </button>

                                <button
                                    type="button"
                                    onClick={resetAuth}
                                    className="w-full text-gray-500 hover:text-emerald-600 transition-colors text-sm"
                                >
                                    ← Start Over
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-400 text-sm mt-6">
                    By continuing, you agree to our Terms of Service & Privacy Policy
                </p>
            </div>
        </div>
    );
}
