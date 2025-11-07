import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaShieldAlt, FaUserSlash, FaCamera, FaEdit } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// Import Components
import ProfileHeader from "../Profile/ProfileSub/ProfileHeader";
import ProfileTab from "../Profile/ProfileSub/ProfileTab";
import SecurityTab from "../Profile/ProfileSub/SecurityTab";
import DangerZoneTab from "../Profile/ProfileSub/DangerZoneTab";
import Popup from "../Profile/ProfileSub/Popup";

const Profile = () => {
    const {
        user,
        updateProfile,
        changePassword,
        logout,
        logoutAll,
        deleteAccount,
        addPhone,
        verifyPhone,
        addSecondaryEmail,
        verifySecondaryEmail,
        sendPrimaryEmailVerification
    } = useAuth();

    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('profile');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isAvatarHovered, setIsAvatarHovered] = useState(false);

    // Popup states
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showLogoutAllPopup, setShowLogoutAllPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const fileInputRef = useRef(null);

    // Individual editing states
    const [editingField, setEditingField] = useState(null);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        address: user?.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'India'
        }
    });

    const [phoneData, setPhoneData] = useState({
        phone: '',
        otp: '',
        otpSent: false
    });

    const [emailData, setEmailData] = useState({
        secondaryEmail: '',
        otp: '',
        otpSent: false
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Check for email verification success
    useEffect(() => {
        const verified = searchParams.get('verified');
        if (verified === 'true') {
            toast.success("Email verified successfully!", {
                duration: 5000,
                position: "bottom-left"
            });
            window.history.replaceState({}, '', '/profile');
        }
    }, [searchParams]);

    // Primary Email Verification Handler
    const handleSendPrimaryEmailVerification = async () => {
        try {
            await sendPrimaryEmailVerification();
        } catch (error) {
            // Error handled in AuthContext
        }
    };

    // Send OTP Handler
    const handleAddPhone = async () => {
        if (!phoneData.phone || phoneData.phone.length !== 10) {
            return;
        }

        try {
            await addPhone(phoneData.phone);
            setPhoneData(prev => ({ ...prev, otpSent: true }));
        } catch (error) { }
    };

    // Verify OTP Handler
    const handleVerifyPhone = async () => {
        if (!phoneData.otp) {
            return;
        }

        try {
            await verifyPhone(phoneData.otp);
            setPhoneData({ phone: '', otp: '', otpSent: false });
            setEditingField(null);
        } catch (error) { }
    };

    // Secondary Email Handlers
    const handleUpdateSecondaryEmail = async () => {
        if (!emailData.secondaryEmail) {
            return;
        }

        try {
            await updateProfile({ secondaryEmail: emailData.secondaryEmail });
            setEmailData(prev => ({ ...prev, otpSent: false }));
        } catch (error) {
            // Error handled in AuthContext
        }
    };

    const handleAddSecondaryEmail = async () => {
        try {
            await addSecondaryEmail(emailData.secondaryEmail);
            setEmailData(prev => ({ ...prev, otpSent: true }));
        } catch (error) {
            // Error handled in AuthContext
        }
    };

    const handleVerifySecondaryEmail = async () => {
        if (!emailData.otp) {
            return;
        }
        try {
            await verifySecondaryEmail(emailData.otp);
            setEmailData({ secondaryEmail: '', otp: '', otpSent: false });
            setEditingField(null);
        } catch (error) {
            // Error handled in AuthContext
        }
    };

    // Profile Update Handlers
    const handleUpdateName = async () => {
        try {
            await updateProfile({ name: profileData.name });
            setEditingField(null);
        } catch (error) {
            // Error handled in AuthContext
        }
    };

    const handleUpdateAddress = async () => {
        try {
            await updateProfile({ address: profileData.address });
            setEditingField(null);
        } catch (error) {
            // Error handled in AuthContext
        }
    };

    // Avatar Handlers
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type and size
            if (!file.type.startsWith('image/')) {
                toast.error("Please select a valid image file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Image size should be less than 5MB");
                return;
            }

            try {
                const formData = new FormData();
                formData.append("avatar", file);
                await updateProfile(formData);
                toast.success("Profile picture updated successfully!");
            } catch (error) {
                // Error handled in AuthContext
            }
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return;
        }

        try {
            await changePassword({
                currentPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            });

            setIsChangingPassword(false);
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            // Error handled in AuthContext
        }
    };

    const handleLogout = () => {
        setShowLogoutPopup(true);
    };

    const handleLogoutConfirm = async () => {
        setShowLogoutPopup(false);
        try {
            await logout();
        } catch (error) {
            // Error handled in AuthContext
        }
    };

    const handleLogoutAll = () => {
        setShowLogoutAllPopup(true);
    };

    const handleLogoutAllConfirm = async () => {
        setShowLogoutAllPopup(false);
        try {
            await logoutAll();
        } catch (error) {
            // Error handled in AuthContext
        }
    };

    const handleDeleteAccount = () => {
        setShowDeletePopup(true);
    };

    const handleDeleteConfirm = async () => {
        setShowDeletePopup(false);
        try {
            await deleteAccount();
        } catch (error) {
            // Error handled in AuthContext
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'security', label: 'Security', icon: FaShieldAlt },
        { id: 'danger', label: 'Danger Zone', icon: FaUserSlash }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Profile Settings
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Manage your account settings and personalize your experience
                    </p>
                </motion.div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                    {/* Profile Header with Enhanced Avatar */}
                    <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Avatar with Edit Overlay */}
                            <div className="relative group">
                                <div
                                    className="relative w-32 h-32 rounded-2xl border-4 border-white/20 shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:border-white/40"
                                    onMouseEnter={() => setIsAvatarHovered(true)}
                                    onMouseLeave={() => setIsAvatarHovered(false)}
                                    onClick={handleAvatarClick}
                                >
                                    <img
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=ffffff&size=128`}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Edit Overlay */}
                                    <AnimatePresence>
                                        {isAvatarHovered && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl"
                                            >
                                                <div className="text-white text-center">
                                                    <FaCamera className="w-6 h-6 mx-auto mb-1" />
                                                    <span className="text-xs font-medium">Change Photo</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Edit Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAvatarClick}
                                    className="absolute -bottom-2 -right-2 bg-white text-indigo-600 p-2 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
                                >
                                    <FaEdit className="w-4 h-4" />
                                </motion.button>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
                                <p className="text-indigo-100 text-lg mb-4">{user.email}</p>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    {user.isEmailVerified && (
                                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                            ✅ Email Verified
                                        </span>
                                    )}
                                    {user.isPhoneVerified && (
                                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                            📱 Phone Verified
                                        </span>
                                    )}
                                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                        👤 Member since {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>

                                </div>
                            </div>
                        </div>

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200/60 bg-white/50 backdrop-blur-sm">
                        <nav className="flex overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-8 py-5 border-b-2 font-semibold text-sm transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                                        }`}
                                >
                                    <tab.icon className={`w-5 h-5 transition-colors ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'
                                        }`} />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8 bg-white/30 backdrop-blur-sm">
                        <AnimatePresence mode="wait">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ProfileTab
                                        user={user}
                                        editingField={editingField}
                                        setEditingField={setEditingField}
                                        profileData={profileData}
                                        setProfileData={setProfileData}
                                        onUpdateName={handleUpdateName}
                                        onUpdateAddress={handleUpdateAddress}
                                        phoneData={phoneData}
                                        setPhoneData={setPhoneData}
                                        onAddPhone={handleAddPhone}
                                        onVerifyPhone={handleVerifyPhone}
                                        emailData={emailData}
                                        setEmailData={setEmailData}
                                        onUpdateSecondaryEmail={handleUpdateSecondaryEmail}
                                        onAddSecondaryEmail={handleAddSecondaryEmail}
                                        onVerifySecondaryEmail={handleVerifySecondaryEmail}
                                        onSendPrimaryEmailVerification={handleSendPrimaryEmailVerification}
                                    />
                                </motion.div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <SecurityTab
                                        isChangingPassword={isChangingPassword}
                                        setIsChangingPassword={setIsChangingPassword}
                                        passwordData={passwordData}
                                        setPasswordData={setPasswordData}
                                        onPasswordChange={handlePasswordChange}
                                    />
                                </motion.div>
                            )}

                            {/* Danger Zone Tab */}
                            {activeTab === 'danger' && (
                                <motion.div
                                    key="danger"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <DangerZoneTab
                                        onLogout={handleLogout}
                                        onLogoutAll={handleLogoutAll}
                                        onDeleteAccount={handleDeleteAccount}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Popups */}
            <Popup
                isOpen={showLogoutPopup}
                onClose={() => setShowLogoutPopup(false)}
                onConfirm={handleLogoutConfirm}
                title="Logout"
                description="Are you sure you want to logout from your current session?"
                type="warning"
                confirmText="Logout"
            />

            <Popup
                isOpen={showLogoutAllPopup}
                onClose={() => setShowLogoutAllPopup(false)}
                onConfirm={handleLogoutAllConfirm}
                title="Logout from All Devices"
                description="This will sign you out from all devices where you're currently logged in."
                type="warning"
                confirmText="Logout All"
            />

            <Popup
                isOpen={showDeletePopup}
                onClose={() => setShowDeletePopup(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Account"
                description="This action cannot be undone. This will permanently delete your account."
                type="danger"
                confirmText="Delete Account"
            />
        </div>
    );
};

export default Profile;