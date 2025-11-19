import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaEdit, FaSave, FaTimes, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle, FaExclamationTriangle, FaKey, FaBirthdayCake } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProfileTab = ({
    user,
    editingField,
    setEditingField,
    profileData,
    setProfileData,
    onUpdateName,
    onUpdateAddress,
    phoneData,
    setPhoneData,
    onAddPhone,
    onVerifyPhone,
    emailData,
    setEmailData,
    onAddSecondaryEmail,
    onVerifySecondaryEmail,
    onSendPrimaryEmailVerification,
    onUpdateDOB, // New prop for updating date of birth
    isUpdatingName,
    isUpdatingAddress,
    isUpdatingPhone,
    isUpdatingSecondaryEmail,
    isUpdatingDOB // New prop for DOB updating state
}) => {
    // Safe access to user properties with fallbacks
    const safeUser = {
        name: user?.name || '',
        email: user?.email || '',
        isEmailVerified: user?.isEmailVerified || false,
        phone: user?.phone || '',
        isPhoneVerified: user?.isPhoneVerified || false,
        secondaryEmail: user?.secondaryEmail || '',
        secondaryEmailVerified: user?.secondaryEmailVerified || false,
        dob: user?.dob ? new Date(user.dob) : null, // only once!
        address: user?.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        }
    };


    // Initialize phone data with current user phone when editing starts
    const handleEditPhone = () => {
        setPhoneData({
            phone: safeUser.phone || '',
            otp: '',
            otpSent: false
        });
        setEditingField('phone');
    };

    // Initialize email data
    const handleEditEmail = () => {
        setEmailData({
            secondaryEmail: safeUser.secondaryEmail || '',
            otp: '',
            otpSent: false
        });
        setEditingField('secondaryEmail');
    };

    // Handle DOB date change
    const handleDOBChange = (date) => {
        setProfileData({
            ...profileData,
            dob: date
        });
    };

    // Format date for display
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Calculate age from DOB
    const calculateAge = (dob) => {
        if (!dob) return null;
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const userAge = safeUser.dob ? calculateAge(safeUser.dob) : null;

    return (
        <div className="space-y-6">
            {/* Name Field */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <FaUser className="text-indigo-600 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900">Full Name</h4>
                            <p className="text-xs sm:text-sm text-gray-500">Your display name</p>
                        </div>
                    </div>
                    {editingField !== 'name' ? (
                        <button
                            onClick={() => setEditingField('name')}
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 w-full sm:w-auto justify-center"
                        >
                            <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setEditingField(null)}
                                disabled={isUpdatingName} // Disable cancel while updating
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-lg transition-all duration-200 flex-1 sm:flex-none justify-center"
                            >
                                <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                                Cancel
                            </button>
                            <button
                                onClick={onUpdateName}
                                disabled={isUpdatingName || !profileData.name?.trim()} // Disable if updating or empty name
                                className="flex items-center gap-2 text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-lg transition-all duration-200 flex-1 sm:flex-none justify-center"
                            >
                                {isUpdatingName ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="w-3 h-3 sm:w-4 sm:h-4" />
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {editingField === 'name' ? (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            disabled={isUpdatingName} // Disable input while updating
                            className="w-full p-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            placeholder="Enter your full name"
                        />
                        {isUpdatingName && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2 mt-2 text-indigo-600 text-xs"
                            >
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></div>
                                Updating your name...
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <div className="flex items-center justify-between">
                        <p className="text-gray-900 text-base sm:text-lg font-medium">{safeUser.name}</p>
                        {isUpdatingName && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                        )}
                    </div>
                )}
            </div>

            {/* Date of Birth Field */}
            <div className="bg-linear-to-r from-white to-white rounded-xl p-4 sm:p-6 border border-pink-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 rounded-lg">
                            <FaBirthdayCake className="text-pink-600 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900">Date of Birth</h4>
                            <p className="text-xs sm:text-sm text-gray-500">Your Age {`: ${userAge} years old`}</p>
                        </div>
                    </div>
                    {editingField !== 'dob' ? (
                        <button
                            onClick={() => setEditingField('dob')}
                            className="flex items-center gap-2 text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 w-full sm:w-auto justify-center"
                        >
                            <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                            {safeUser.dob ? "Edit" : "Add DOB"}
                        </button>
                    ) : (
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setEditingField(null)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all duration-200 flex-1 sm:flex-none justify-center"
                            >
                                <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                                Cancel
                            </button>
                            <button
                                onClick={onUpdateDOB}
                                disabled={!profileData.dob}
                                className="flex items-center gap-2 text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-lg transition-all duration-200 flex-1 sm:flex-none justify-center"
                            >
                                <FaSave className="w-3 h-3 sm:w-4 sm:h-4" />
                                Save
                            </button>
                        </div>
                    )}
                </div>

                {editingField === 'dob' ? (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <div className="flex-1 relative">
                                <DatePicker
                                    selected={profileData.dob}
                                    onChange={handleDOBChange}
                                    dateFormat="dd/MM/yyyy"
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    yearDropdownItemNumber={100}
                                    scrollableYearDropdown
                                    maxDate={new Date()}
                                    minDate={new Date(new Date().getFullYear() - 100, 0, 1)}
                                    placeholderText="dd/mm/yyyy"
                                    className="w-full p-3 pl-10 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
                                    isClearable
                                    withPortal
                                    popperClassName="z-50"
                                    popperPlacement="bottom-start"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaCalendarAlt className="w-4 h-4" />
                                </div>
                            </div>

                            {profileData.dob && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 min-w-[120px] text-center"
                                >
                                    <p className="text-xs text-green-600 font-semibold">
                                        {calculateAge(profileData.dob)} years old
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Validation messages */}
                        {profileData.dob && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`text-xs font-medium ${calculateAge(profileData.dob) < 13
                                    ? 'text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg'
                                    : 'text-green-600 bg-green-50 border border-green-200 p-2 rounded-lg'
                                    }`}
                            >
                                {calculateAge(profileData.dob) < 13
                                    ? '⚠️ You must be at least 13 years old to use this service'
                                    : '✓ Age requirement satisfied'
                                }
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <div className="text-gray-700">
                        {safeUser.dob ? (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <p className="text-lg sm:text-xl font-semibold text-gray-900">
                                        {formatDate(safeUser.dob)}
                                    </p>
                                    <p className="text-pink-600 font-medium text-sm sm:text-base">
                                        {userAge} years old
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                    <FaCheckCircle className="w-3 h-3" />
                                    Verified
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 bg-gray-100 p-4 rounded-lg text-center">
                                <FaBirthdayCake className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">No date of birth added</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Primary Email - Only show verification section if not verified */}
            {!safeUser.isEmailVerified && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FaEnvelope className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Verify Primary Email</h4>
                                <p className="text-xs sm:text-sm text-blue-600">Secure your account with email verification</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-gray-700 font-medium text-sm sm:text-base break-all">{safeUser.email}</p>
                            <div className="flex items-center gap-2 text-amber-600 mt-1">
                                <FaExclamationTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-xs sm:text-sm font-medium">Email not verified</span>
                            </div>
                        </div>

                        <button
                            onClick={onSendPrimaryEmailVerification}
                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-3 sm:px-5 sm:py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
                        >
                            <FaKey className="w-3 h-3 sm:w-4 sm:h-4" />
                            Verify Email
                        </button>
                    </div>

                    <p className="text-xs sm:text-sm text-blue-600 mt-3">
                        We'll send a verification link to your email address. Click the link to verify your account.
                    </p>
                </div>
            )}

            {/* Primary Email Display - Show when verified */}
            {safeUser.isEmailVerified && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FaEnvelope className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Primary Email</h4>
                                <p className="text-gray-700 font-medium text-sm sm:text-base break-all">{safeUser.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-full w-full sm:w-auto justify-center mt-2 sm:mt-0">
                            <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-medium">Verified</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Phone Verification */}
            <div className="bg-linear-to-r from-gray-50 to-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <FaPhone className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900">Phone Number</h4>
                            <p className="text-xs sm:text-sm text-gray-500">Add a phone number for security</p>
                        </div>
                    </div>

                    {editingField !== 'phone' && (
                        <button
                            onClick={handleEditPhone}
                            disabled={isUpdatingPhone}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 w-full sm:w-auto justify-center"
                        >
                            <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                            {safeUser.phone ? "Edit / Verify" : "Add Phone"}
                        </button>
                    )}
                </div>

                {/* Status Display */}
                {safeUser.isPhoneVerified ? (
                    <div className="flex items-center justify-between gap-3 text-green-600 bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm sm:text-base">Verified Phone Number</p>
                                <p className="text-xs sm:text-sm truncate">{safeUser.phone}</p>
                            </div>
                        </div>
                        {isUpdatingPhone && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        )}
                    </div>
                ) : safeUser.phone ? (
                    <div className="flex items-center justify-between gap-3 text-amber-600 bg-amber-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FaExclamationTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm sm:text-base">Phone Not Verified</p>
                                <p className="text-xs sm:text-sm truncate">{safeUser.phone}</p>
                            </div>
                        </div>
                        {isUpdatingPhone && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                        )}
                    </div>
                ) : (
                    <div className="text-gray-500 bg-gray-100 p-4 rounded-lg text-center">
                        <FaPhone className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No phone number added</p>
                    </div>
                )}

                <AnimatePresence>
                    {editingField === 'phone' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 sm:mt-6 space-y-4"
                        >
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                <p className="text-xs sm:text-sm text-blue-700">
                                    Enter your 10-digit phone number to receive verification OTP
                                </p>
                            </div>

                            {/* Phone Input */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <input
                                        type="tel"
                                        value={phoneData.phone}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                            setPhoneData({ ...phoneData, phone: value });
                                        }}
                                        placeholder="Enter 10-digit phone number"
                                        className="w-full p-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        maxLength={10}
                                        disabled={phoneData.otpSent || isUpdatingPhone}
                                    />
                                </div>

                                <div className="flex gap-2 sm:gap-3">
                                    <button
                                        onClick={onAddPhone}
                                        disabled={!phoneData.phone || phoneData.phone.length !== 10 || isUpdatingPhone}
                                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-1 sm:flex-none justify-center text-sm sm:text-base"
                                    >
                                        {isUpdatingPhone ? (
                                            <>
                                                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <FaKey className="w-3 h-3 sm:w-4 sm:h-4" />
                                                Send OTP
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setEditingField(null)}
                                        disabled={isUpdatingPhone}
                                        className="px-4 py-3 sm:px-6 sm:py-3 text-gray-600 hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 flex-1 sm:flex-none justify-center text-sm sm:text-base"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            {/* OTP Input */}
                            {phoneData.otpSent && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={phoneData.otp}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                                                    setPhoneData({ ...phoneData, otp: value });
                                                }}
                                                placeholder="Enter OTP"
                                                className="w-full p-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                maxLength={6}
                                                disabled={isUpdatingPhone}
                                            />
                                        </div>

                                        <button
                                            onClick={onVerifyPhone}
                                            disabled={!phoneData.otp || phoneData.otp.length !== 6 || isUpdatingPhone}
                                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
                                        >
                                            {isUpdatingPhone ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                                                    Verifying...
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    Verify
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        Enter the 6-digit OTP sent to your phone
                                    </p>
                                </motion.div>
                            )}

                            {/* Loading indicator */}
                            {isUpdatingPhone && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 text-purple-600 text-xs"
                                >
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                                    Processing your request...
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Secondary Email */}
            <div className="bg-linear-to-r from-gray-50 to-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <FaEnvelope className="text-orange-600 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900">Secondary Email</h4>
                            <p className="text-xs sm:text-sm text-gray-500">Backup email for account recovery</p>
                        </div>
                    </div>
                    {editingField !== 'secondaryEmail' && (
                        <button
                            onClick={handleEditEmail}
                            disabled={isUpdatingSecondaryEmail}
                            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 w-full sm:w-auto justify-center"
                        >
                            <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                            {safeUser.secondaryEmail ? "Change Email" : "Add Email"}
                        </button>
                    )}
                </div>

                {safeUser.secondaryEmailVerified ? (
                    <div className="flex items-center justify-between gap-3 text-green-600 bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm sm:text-base">Verified Secondary Email</p>
                                <p className="text-xs sm:text-sm break-all">{safeUser.secondaryEmail}</p>
                            </div>
                        </div>
                        {isUpdatingSecondaryEmail && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        )}
                    </div>
                ) : safeUser.secondaryEmail ? (
                    <div className="flex items-center justify-between gap-3 text-amber-600 bg-amber-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FaExclamationTriangle className="w-4 h-4 sm:w-5 sm:w-5" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm sm:text-base">Email Not Verified</p>
                                <p className="text-xs sm:text-sm break-all">{safeUser.secondaryEmail}</p>
                            </div>
                        </div>
                        {isUpdatingSecondaryEmail && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                        )}
                    </div>
                ) : (
                    <div className="text-gray-500 bg-gray-100 p-4 rounded-lg text-center">
                        <FaEnvelope className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No secondary email added</p>
                    </div>
                )}

                <AnimatePresence>
                    {editingField === 'secondaryEmail' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 sm:mt-6 space-y-4"
                        >
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                <p className="text-xs sm:text-sm text-blue-700">
                                    Enter your secondary email address to receive verification OTP
                                </p>
                            </div>

                            {/* Email Input */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <input
                                        type="email"
                                        value={emailData.secondaryEmail}
                                        onChange={(e) => setEmailData({ ...emailData, secondaryEmail: e.target.value })}
                                        placeholder="Enter secondary email address"
                                        className="w-full p-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={emailData.otpSent || isUpdatingSecondaryEmail}
                                    />
                                </div>

                                <div className="flex gap-2 sm:gap-3">
                                    {/* Verify Button */}
                                    {!emailData.otpSent && (
                                        <button
                                            onClick={onAddSecondaryEmail}
                                            disabled={!emailData.secondaryEmail || isUpdatingSecondaryEmail}
                                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-1 sm:flex-none justify-center text-sm sm:text-base"
                                        >
                                            {isUpdatingSecondaryEmail ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <FaKey className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    Verify Email
                                                </>
                                            )}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            setEditingField(null);
                                            setEmailData({ secondaryEmail: '', otp: '', otpSent: false });
                                        }}
                                        disabled={isUpdatingSecondaryEmail}
                                        className="px-4 py-3 sm:px-6 sm:py-3 text-gray-600 hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 flex-1 sm:flex-none justify-center text-sm sm:text-base"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            {/* OTP Input Section */}
                            {emailData.otpSent && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <p className="text-xs sm:text-sm text-green-700">
                                            OTP sent to: <strong className="break-all">{emailData.secondaryEmail}</strong>
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={emailData.otp}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                    setEmailData({ ...emailData, otp: value });
                                                }}
                                                placeholder="Enter 6-digit OTP"
                                                className="w-full p-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                maxLength={6}
                                                disabled={isUpdatingSecondaryEmail}
                                            />
                                        </div>
                                        <button
                                            onClick={onVerifySecondaryEmail}
                                            disabled={!emailData.otp || emailData.otp.length !== 6 || isUpdatingSecondaryEmail}
                                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
                                        >
                                            {isUpdatingSecondaryEmail ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                                                    Verifying...
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    Verify OTP
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Resend OTP option */}
                                    <div className="flex justify-center">
                                        <button
                                            onClick={onAddSecondaryEmail}
                                            disabled={isUpdatingSecondaryEmail}
                                            className="text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors duration-200"
                                        >
                                            Resend OTP
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Loading indicator */}
                            {isUpdatingSecondaryEmail && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 text-orange-600 text-xs"
                                >
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600"></div>
                                    Processing your request...
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Address Section */}
            <div className="bg-linear-to-r from-gray-50 to-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-50 rounded-lg">
                            <FaMapMarkerAlt className="text-teal-600 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900">Address</h4>
                            <p className="text-xs sm:text-sm text-gray-500">Your physical address</p>
                        </div>
                    </div>
                    {editingField !== 'address' ? (
                        <button
                            onClick={() => setEditingField('address')}
                            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 w-full sm:w-auto justify-center"
                        >
                            <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setEditingField(null)}
                                disabled={isUpdatingAddress}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-lg transition-all duration-200 flex-1 sm:flex-none justify-center"
                            >
                                <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                                Cancel
                            </button>
                            <button
                                onClick={onUpdateAddress}
                                disabled={isUpdatingAddress}
                                className="flex items-center gap-2 text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-lg transition-all duration-200 flex-1 sm:flex-none justify-center"
                            >
                                {isUpdatingAddress ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="w-3 h-3 sm:w-4 sm:h-4" />
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {editingField === 'address' ? (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                            <div>
                                <input
                                    type="text"
                                    value={profileData.address?.street || ''}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        address: {
                                            ...profileData.address,
                                            street: e.target.value
                                        }
                                    })}
                                    disabled={isUpdatingAddress}
                                    placeholder="Street Address"
                                    className="w-full p-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <input
                                    type="text"
                                    value={profileData.address?.city || ''}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        address: {
                                            ...profileData.address,
                                            city: e.target.value
                                        }
                                    })}
                                    disabled={isUpdatingAddress}
                                    placeholder="City"
                                    className="w-full p-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                />

                                <input
                                    type="text"
                                    value={profileData.address?.state || ''}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        address: {
                                            ...profileData.address,
                                            state: e.target.value
                                        }
                                    })}
                                    disabled={isUpdatingAddress}
                                    placeholder="State"
                                    className="w-full p-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <input
                                    type="text"
                                    value={profileData.address?.zipCode || ''}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        address: {
                                            ...profileData.address,
                                            zipCode: e.target.value
                                        }
                                    })}
                                    disabled={isUpdatingAddress}
                                    placeholder="ZIP Code"
                                    className="w-full p-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                />

                                <input
                                    type="text"
                                    value={profileData.address?.country}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        address: {
                                            ...profileData.address,
                                            country: e.target.value
                                        }
                                    })}
                                    disabled={isUpdatingAddress}
                                    placeholder="Country"
                                    className="w-full p-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                />
                            </div>
                        </div>

                        {isUpdatingAddress && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2 text-teal-600 text-xs"
                            >
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-teal-600"></div>
                                Updating your address...
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <div className="text-gray-700 space-y-2">
                        {safeUser.address?.street ? (
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium text-sm sm:text-base">{safeUser.address.street}</p>
                                    <p className="text-gray-600 text-xs sm:text-sm">
                                        {safeUser.address.city}, {safeUser.address.state} {safeUser.address.zipCode}
                                    </p>
                                    <p className="text-gray-500 text-xs sm:text-sm">{safeUser.address.country}</p>
                                </div>
                                {isUpdatingAddress && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                                )}
                            </div>
                        ) : (
                            <div className="text-gray-500 bg-gray-100 p-4 rounded-lg text-center">
                                <FaMapMarkerAlt className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">No address added</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileTab;