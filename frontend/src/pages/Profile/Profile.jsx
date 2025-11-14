import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaShieldAlt, FaUserSlash, FaCamera, FaEdit, FaCheck } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Import Components
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

    const navigate = useNavigate();

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

    // Enhanced animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const tabContentVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            x: -20,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    const avatarVariants = {
        normal: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    const badgeVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    };

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
            } catch (error) {
                // Error handled in AuthContext
            }
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) return;

        try {
            await changePassword({
                currentPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            });

            // Keep UI state clean
            setIsChangingPassword(false);
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            // ✅ Delay navigation so toast stays visible
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) { }
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
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-12 w-12 border-b-2 border-indigo-600"
                ></motion.div>
            </motion.div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'security', label: 'Security', icon: FaShieldAlt },
        { id: 'danger', label: 'Danger Zone', icon: FaUserSlash }
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Clean Header */}
                <motion.div
                    variants={itemVariants}
                    className="text-center mb-12"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent mb-4"
                    >
                        Profile Settings
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="text-gray-600 text-lg max-w-2xl mx-auto"
                    >
                        Manage your account settings and personalize your experience
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
                >
                    {/* Clean Profile Header with Rounded Avatar */}
                    <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Enhanced Rounded Avatar with Centered Image */}
                            <motion.div
                                className="relative group"
                                variants={avatarVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <motion.div
                                    className="relative w-32 h-32 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden cursor-pointer"
                                    onMouseEnter={() => setIsAvatarHovered(true)}
                                    onMouseLeave={() => setIsAvatarHovered(false)}
                                    onClick={handleAvatarClick}
                                    whileHover={{
                                        scale: 1.05,
                                        borderColor: "rgba(255,255,255,0.6)"
                                    }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <img
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=ffffff&size=128`}
                                        alt={user.name}
                                        className="w-full h-full object-cover object-center"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                user.name
                                            )}&background=6366f1&color=ffffff&size=128`;
                                        }}
                                    />


                                    {/* Enhanced Edit Overlay */}
                                    <AnimatePresence>
                                        {isAvatarHovered && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full"
                                                transition={{ duration: 0.2 }}
                                            >
                                                <motion.div
                                                    initial={{ y: 10 }}
                                                    animate={{ y: 0 }}
                                                    className="text-white text-center"
                                                >
                                                    <FaCamera className="w-6 h-6 mx-auto mb-1" />
                                                    <span className="text-xs font-medium">Change Photo</span>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Floating Edit Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 15 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleAvatarClick}
                                    className="absolute -bottom-2 -right-2 bg-white text-indigo-600 p-2 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
                                >
                                    <FaEdit className="w-4 h-4" />
                                </motion.button>


                            </motion.div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl font-bold text-white mb-2"
                                >
                                    {user.name}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-indigo-100 text-lg mb-4"
                                >
                                    {user.email}
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-wrap gap-2 justify-center md:justify-start"
                                >
                                    {user.isEmailVerified && (
                                        <motion.span
                                            variants={badgeVariants}
                                            className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                                        >
                                            ✅ Email Verified
                                        </motion.span>
                                    )}
                                    {user.isPhoneVerified && (
                                        <motion.span
                                            variants={badgeVariants}
                                            className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                                        >
                                            📱 Phone Verified
                                        </motion.span>
                                    )}
                                    <motion.span
                                        variants={badgeVariants}
                                        className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                                    >
                                        👤 Member since {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </motion.span>
                                </motion.div>
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

                    {/* Enhanced Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="border-b border-gray-200 bg-white"
                    >
                        <nav className="flex overflow-x-auto">
                            {tabs.map((tab, index) => (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                    className={`relative flex items-center gap-3 px-8 py-5 border-b-2 font-semibold text-sm transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-indigo-600 text-indigo-600 bg-gray-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <tab.icon className={`w-5 h-5 transition-colors duration-300 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'
                                        }`} />
                                    {tab.label}
                                </motion.button>
                            ))}
                        </nav>
                    </motion.div>

                    {/* Tab Content */}
                    <div className="p-8 bg-gray-50/50">
                        <AnimatePresence mode="wait">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    variants={tabContentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
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
                                    variants={tabContentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
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
                                    variants={tabContentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
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
                </motion.div>
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
        </motion.div>
    );
};

export default Profile;