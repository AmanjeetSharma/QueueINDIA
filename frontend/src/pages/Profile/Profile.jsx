import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaShieldAlt, FaUserSlash, FaCamera, FaEdit, FaCheck, FaGoogle, FaBars, FaTimes } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Import Components
import ProfileTab from "../Profile/ProfileSub/ProfileTab";
import SecurityTab from "../Profile/ProfileSub/SecurityTab";
import DangerZoneTab from "../Profile/ProfileSub/DangerZoneTab";
import GooglePasswordTab from "./ProfileSub/GooglePasswordTab";
import Popup from "../Profile/ProfileSub/Popup";
import { getDominantColor, createGradientFromColor, createSimpleGradient, getTextColorForBackground } from "../../utils/colorExtractor";

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
        sendPrimaryEmailVerification,
        updateDOB,
        setGoogleUserPassword
    } = useAuth();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('profile');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isAvatarHovered, setIsAvatarHovered] = useState(false);
    const [bannerColor, setBannerColor] = useState('linear-gradient(135deg, #6366f1, #8b5cf6)');
    const [isExtractingColor, setIsExtractingColor] = useState(false);
    const [textColor, setTextColor] = useState('#ffffff');
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
    const [lastProcessedAvatar, setLastProcessedAvatar] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Individual loading states
    const [isUpdatingName, setIsUpdatingName] = useState(false);
    const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
    const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
    const [isUpdatingSecondaryEmail, setIsUpdatingSecondaryEmail] = useState(false);
    const [isUpdatingDOB, setIsUpdatingDOB] = useState(false);
    const [isSettingGooglePassword, setIsSettingGooglePassword] = useState(false);

    // Popup states
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showLogoutAllPopup, setShowLogoutAllPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const fileInputRef = useRef(null);

    // Form states
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

    const [googlePasswordData, setGooglePasswordData] = useState({
        newGooglePassword: '',
        confirmGooglePassword: ''
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

    // Extract color from avatar
    useEffect(() => {
        const extractColorFromAvatar = async () => {
            if (!user?.avatar || user.avatar === lastProcessedAvatar || isExtractingColor) {
                return;
            }

            setIsExtractingColor(true);
            try {
                const avatarUrl = user.avatar.startsWith('http')
                    ? user.avatar + '?t=' + Date.now()
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=ffffff&size=128`;

                const dominantColor = await getDominantColor(avatarUrl);
                let gradient;
                try {
                    gradient = createGradientFromColor(dominantColor);
                } catch (error) {
                    gradient = createSimpleGradient(dominantColor);
                }

                setBannerColor(gradient);
                const optimalTextColor = getTextColorForBackground(dominantColor);
                setTextColor(optimalTextColor);
                setLastProcessedAvatar(user.avatar);

            } catch (error) {
                console.log('Error extracting color, using default:', error);
            } finally {
                setIsExtractingColor(false);
            }
        };

        extractColorFromAvatar();
    }, [user?.avatar, user?.name]);

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

    // Close mobile menu when tab changes
    useEffect(() => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    }, [activeTab]);

    // Handlers (keeping all your existing handlers)
    const handleSendPrimaryEmailVerification = async () => {
        try {
            await sendPrimaryEmailVerification();
        } catch (error) {}
    };

    const handleSetGooglePassword = async (e) => {
        e?.preventDefault();

        if (googlePasswordData.newGooglePassword !== googlePasswordData.confirmGooglePassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (googlePasswordData.newGooglePassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsSettingGooglePassword(true);
        try {
            await setGoogleUserPassword(
                googlePasswordData.newGooglePassword,
                googlePasswordData.confirmGooglePassword
            );

            setGooglePasswordData({
                newGooglePassword: '',
                confirmGooglePassword: ''
            });
            setActiveTab('security');
        } catch (error) {
        } finally {
            setIsSettingGooglePassword(false);
        }
    };

    const handleUpdateDOB = async () => {
        setIsUpdatingDOB(true);
        try {
            await updateDOB(profileData.dob);
            setEditingField(null);
            setProfileData(prev => ({
                ...prev,
                dob: user?.dob ? new Date(user.dob) : null
            }));
        } catch (error) {
        } finally {
            setIsUpdatingDOB(false);
        }
    };

    const handleAddPhone = async () => {
        if (!phoneData.phone || phoneData.phone.length !== 10) {
            return;
        }

        setIsUpdatingPhone(true);
        try {
            await addPhone(phoneData.phone);
            setPhoneData(prev => ({ ...prev, otpSent: true }));
        } catch (error) {
        } finally {
            setIsUpdatingPhone(false);
        }
    };

    const handleVerifyPhone = async () => {
        if (!phoneData.otp) {
            return;
        }

        setIsUpdatingPhone(true);
        try {
            await verifyPhone(phoneData.otp);
            setPhoneData({ phone: '', otp: '', otpSent: false });
            setEditingField(null);
        } catch (error) {
        } finally {
            setIsUpdatingPhone(false);
        }
    };

    const handleUpdateSecondaryEmail = async () => {
        if (!emailData.secondaryEmail) {
            return;
        }

        try {
            await updateProfile({ secondaryEmail: emailData.secondaryEmail });
            setEmailData(prev => ({ ...prev, otpSent: false }));
        } catch (error) {}
    };

    const handleAddSecondaryEmail = async () => {
        setIsUpdatingSecondaryEmail(true);
        try {
            await addSecondaryEmail(emailData.secondaryEmail);
            setEmailData(prev => ({ ...prev, otpSent: true }));
        } catch (error) {
        } finally {
            setIsUpdatingSecondaryEmail(false);
        }
    };

    const handleVerifySecondaryEmail = async () => {
        if (!emailData.otp) {
            return;
        }
        setIsUpdatingSecondaryEmail(true);
        try {
            await verifySecondaryEmail(emailData.otp);
            setEmailData({ secondaryEmail: '', otp: '', otpSent: false });
            setEditingField(null);
        } catch (error) {
        } finally {
            setIsUpdatingSecondaryEmail(false);
        }
    };

    const handleUpdateName = async () => {
        setIsUpdatingName(true);
        try {
            await updateProfile({ name: profileData.name });
            setEditingField(null);
        } catch (error) {
        } finally {
            setIsUpdatingName(false);
        }
    };

    const handleUpdateAddress = async () => {
        setIsUpdatingAddress(true);
        try {
            await updateProfile({ address: profileData.address });
            setEditingField(null);
        } catch (error) {
        } finally {
            setIsUpdatingAddress(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error("Please select a valid image file");
                return;
            }

            e.target.value = '';
            setIsUpdatingAvatar(true);
            setIsExtractingColor(true);

            try {
                const formData = new FormData();
                formData.append("avatar", file);
                await updateProfile(formData);
            } catch (error) {
                console.log('Error updating avatar:', error);
            } finally {
                setIsExtractingColor(false);
                setIsUpdatingAvatar(false);
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

            setIsChangingPassword(false);
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

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
        } catch (error) {}
    };

    const handleLogoutAll = () => {
        setShowLogoutAllPopup(true);
    };

    const handleLogoutAllConfirm = async () => {
        setShowLogoutAllPopup(false);
        try {
            await logoutAll();
        } catch (error) {}
    };

    const handleDeleteAccount = () => {
        setShowDeletePopup(true);
    };

    const handleDeleteConfirm = async () => {
        setShowDeletePopup(false);
        try {
            await deleteAccount();
        } catch (error) {}
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="rounded-full h-8 w-8 border-b-2 border-indigo-600 animate-spin"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'security', label: 'Security', icon: FaShieldAlt },
        { id: 'google-password', label: 'Google Password', icon: FaGoogle },
        { id: 'danger', label: 'Danger Zone', icon: FaUserSlash }
    ].filter(tab => {
        if (tab.id === 'google-password') {
            return user?.hasPassword === false;
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
                {/* Compact Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Profile Settings
                        </h1>
                        
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <FaTimes className="w-5 h-5 text-gray-600" />
                            ) : (
                                <FaBars className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
                        Manage your account settings
                    </p>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Compact Banner */}
                    <div
                        className="relative p-4 sm:p-6 transition-all duration-500"
                        style={{
                            background: bannerColor,
                            color: textColor
                        }}
                    >
                        {/* Avatar Update Loader */}
                        {(isExtractingColor || isUpdatingAvatar) && (
                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/20 text-white px-2 py-1.5 rounded-full flex items-center gap-1 backdrop-blur-sm border border-white/20 text-xs">
                                <div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin"></div>
                                <span>Updating...</span>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            {/* Compact Avatar */}
                            <div className="relative">
                                <div
                                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-white/40 shadow-lg overflow-hidden cursor-pointer"
                                    onClick={handleAvatarClick}
                                    onMouseEnter={() => setIsAvatarHovered(true)}
                                    onMouseLeave={() => setIsAvatarHovered(false)}
                                >
                                    <img
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=ffffff&size=128`}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                user.name
                                            )}&background=6366f1&color=ffffff&size=128`;
                                        }}
                                    />

                                    {isAvatarHovered && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                                            <div className="text-white text-center">
                                                <FaCamera className="w-4 h-4 mx-auto mb-0.5" />
                                                <span className="text-xs">Edit</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Small Edit Button */}
                                <button
                                    onClick={handleAvatarClick}
                                    disabled={isUpdatingAvatar}
                                    className="absolute -bottom-1 -right-1 bg-white text-gray-700 p-1.5 rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                                >
                                    <FaEdit className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Compact User Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-xl sm:text-2xl font-bold mb-1 line-clamp-1">
                                    {user.name}
                                </h2>
                                <p className="text-sm sm:text-base opacity-90 mb-3 line-clamp-1">
                                    {user.email}
                                </p>
                                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                                    {user.isEmailVerified && (
                                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm border border-white/30">
                                            ✅ Verified
                                        </span>
                                    )}
                                    {user.isPhoneVerified && (
                                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm border border-white/30">
                                            📱 Phone
                                        </span>
                                    )}
                                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm border border-white/30">
                                        Since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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
                            disabled={isUpdatingAvatar}
                        />
                    </div>

                    {/* Compact Tabs - Desktop */}
                    <div className="hidden lg:flex border-b border-gray-200 bg-white">
                        <nav className="flex w-full">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all ${activeTab === tab.id
                                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <span className="text-xs sm:text-sm">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Mobile Tabs Menu */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="lg:hidden border-b border-gray-200 bg-white overflow-hidden"
                            >
                                <nav className="flex flex-col p-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id
                                                ? 'bg-indigo-50 text-indigo-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Mobile Tabs Bar (Always visible on mobile) */}
                    <div className="lg:hidden flex overflow-x-auto border-b border-gray-200 bg-white px-2 py-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 mx-1 rounded-lg font-medium text-xs transition-all ${activeTab === tab.id
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className="w-3 h-3" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 sm:p-6 bg-gray-50/50">
                        <div className="max-w-3xl mx-auto">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
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
                                    onUpdateDOB={handleUpdateDOB}
                                    isUpdatingName={isUpdatingName}
                                    isUpdatingAddress={isUpdatingAddress}
                                    isUpdatingPhone={isUpdatingPhone}
                                    isUpdatingSecondaryEmail={isUpdatingSecondaryEmail}
                                    isUpdatingDOB={isUpdatingDOB}
                                />
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <SecurityTab
                                    isChangingPassword={isChangingPassword}
                                    setIsChangingPassword={setIsChangingPassword}
                                    passwordData={passwordData}
                                    setPasswordData={setPasswordData}
                                    onPasswordChange={handlePasswordChange}
                                />
                            )}

                            {/* Google Password Tab */}
                            {activeTab === 'google-password' && user?.hasPassword === false && (
                                <GooglePasswordTab
                                    googlePasswordData={googlePasswordData}
                                    setGooglePasswordData={setGooglePasswordData}
                                    onSetGooglePassword={handleSetGooglePassword}
                                    isSettingGooglePassword={isSettingGooglePassword}
                                />
                            )}

                            {/* Danger Zone Tab */}
                            {activeTab === 'danger' && (
                                <DangerZoneTab
                                    onLogout={handleLogout}
                                    onLogoutAll={handleLogoutAll}
                                    onDeleteAccount={handleDeleteAccount}
                                />
                            )}
                        </div>
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