import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaKey, FaLock, FaEye, FaEyeSlash, FaArrowLeft,
  FaGoogle, FaShieldAlt, FaCheck, FaExclamationTriangle,
  FaCheckCircle, FaArrowRight, FaMobile
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const SetPassword = () => {
  const navigate = useNavigate();
  const { setGoogleUserPassword } = useAuth();

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Calculate password strength
  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(setTimeout(() => {
      const password = passwordData.newPassword;
      let strength = 0;

      if (password.length >= 8) strength += 25;
      if (password.match(/[a-z]/)) strength += 25;
      if (password.match(/[A-Z]/)) strength += 25;
      if (password.match(/[0-9]/)) strength += 15;
      if (password.match(/[^a-zA-Z0-9]/)) strength += 10;

      setPasswordStrength(Math.min(strength, 100));
    }, 300));

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [passwordData.newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match", {
        icon: <FaExclamationTriangle className="text-yellow-500" />,
        duration: 3000,
        position: "top-center"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        icon: <FaExclamationTriangle className="text-yellow-500" />,
        duration: 3000,
        position: "top-center"
      });
      return;
    }

    setIsLoading(true);
    try {
      await setGoogleUserPassword(
        passwordData.newPassword,
        passwordData.confirmPassword
      );

      // Show success popup
      setShowSuccessPopup(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate("/profile");
      }, 3000);

    } catch (error) {
      // console.log('Password set error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    return "Strong";
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const diagramVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-2 sm:py-4 md:py-6 px-2 sm:px-4 relative"
    >
      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-green-500">
              {/* Progress Bar */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-1 bg-gradient-to-r from-green-400 to-green-600"
              />

              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", damping: 10, delay: 0.1 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FaCheckCircle className="w-8 h-8 text-green-500" />
                </motion.div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Password Set Successfully!
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  Your password has been created. Redirecting to profile...
                </p>

                {/* Animated dots */}
                <div className="flex justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05, x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 transition-colors font-medium text-xs sm:text-sm bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm"
        >
          <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          Back to Profile
        </motion.button>

        <motion.div
          variants={itemVariants}
          className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header with animated gradient */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-6 text-center relative overflow-hidden"
          >
            {/* Animated background pattern */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"
            />
            <motion.div
              animate={{
                rotate: -360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"
            />

            <div className="relative z-10">
              <motion.div
                variants={diagramVariants}
                className="inline-flex items-center gap-2 bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm mb-3"
              >
                <FaGoogle className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                <span className="text-white text-xs font-medium">Google Account</span>
              </motion.div>

              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">
                Set Your Password
              </h1>

              <p className="text-blue-100 text-xs sm:text-sm max-w-sm mx-auto">
                Create a password for your Google-authenticated account
              </p>
            </div>
          </motion.div>

          {/* Password Setup Diagram */}
          <motion.div
            variants={diagramVariants}
            className="px-4 sm:px-6 pt-4 sm:pt-6"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 text-center">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 bg-blue-100 rounded-lg mx-auto flex items-center justify-center"
                >
                  <FaGoogle className="w-4 h-4 text-blue-600" />
                </motion.div>
                <span className="text-xs text-gray-500 mt-1 block">Google Login</span>
              </div>

              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <FaArrowRight className="w-4 h-4 text-gray-400" />
              </motion.div>

              <div className="flex-1 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="w-8 h-8 bg-green-100 rounded-lg mx-auto flex items-center justify-center"
                >
                  <FaKey className="w-4 h-4 text-green-600" />
                </motion.div>
                <span className="text-xs text-gray-500 mt-1 block">Set Password</span>
              </div>

              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              >
                <FaArrowRight className="w-4 h-4 text-gray-400" />
              </motion.div>

              <div className="flex-1 text-center">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                  className="w-8 h-8 bg-purple-100 rounded-lg mx-auto flex items-center justify-center"
                >
                  <FaShieldAlt className="w-4 h-4 text-purple-600" />
                </motion.div>
                <span className="text-xs text-gray-500 mt-1 block">Able To Login Through email/password</span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={itemVariants} className="p-4 sm:p-5 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Info Box */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 sm:p-4"
              >
                <div className="flex items-start gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                  >
                    <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </motion.div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-blue-900 text-xs sm:text-sm">
                      Enhanced Security
                    </p>
                    <p className="text-blue-700 text-xs leading-relaxed">
                      Setting a password allows you to login with email/password alongside Google authentication for backup access
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* New Password Field */}
              <motion.div
                variants={itemVariants}
                animate={focusedField === 'new' ? { scale: 1.02 } : { scale: 1 }}
                className="space-y-1"
              >
                <label className="block text-xs font-semibold text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    onFocus={() => setFocusedField('new')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2.5 sm:py-3 pl-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                    required
                    disabled={isLoading}
                  />
                  <motion.div
                    animate={focusedField === 'new' ? { scale: 1.1, color: '#3B82F6' } : { scale: 1 }}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <FaLock className="w-3.5 h-3.5" />
                  </motion.div>
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword.new ? (
                      <FaEyeSlash className="w-3.5 h-3.5" />
                    ) : (
                      <FaEye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {passwordData.newPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Strength:</span>
                      <span className={`text-xs font-medium ${passwordStrength < 40 ? 'text-red-600' :
                          passwordStrength < 70 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength}%` }}
                        transition={{ duration: 0.3 }}
                        className={`h-full ${getStrengthColor()}`}
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                variants={itemVariants}
                animate={focusedField === 'confirm' ? { scale: 1.02 } : { scale: 1 }}
                className="space-y-1"
              >
                <label className="block text-xs font-semibold text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2.5 sm:py-3 pl-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                    required
                    disabled={isLoading}
                  />
                  <motion.div
                    animate={focusedField === 'confirm' ? { scale: 1.1, color: '#3B82F6' } : { scale: 1 }}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <FaKey className="w-3.5 h-3.5" />
                  </motion.div>
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword.confirm ? (
                      <FaEyeSlash className="w-3.5 h-3.5" />
                    ) : (
                      <FaEye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Password Requirements */}
              <motion.div
                variants={itemVariants}
                className="bg-gray-50 rounded-lg p-3 space-y-2"
              >
                <p className="text-xs font-medium text-gray-700">Password requirements:</p>
                <div className="grid grid-cols-2 gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5"
                  >
                    <motion.div
                      animate={passwordData.newPassword.length >= 8 ? { scale: [1, 1.2, 1] } : {}}
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      {passwordData.newPassword.length >= 8 && (
                        <FaCheck className="text-white text-[10px]" />
                      )}
                    </motion.div>
                    <span className={`text-xs ${passwordData.newPassword.length >= 8 ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                      8+ chars
                    </span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5"
                  >
                    <motion.div
                      animate={/[a-z]/.test(passwordData.newPassword) ? { scale: [1, 1.2, 1] } : {}}
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${/[a-z]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      {/[a-z]/.test(passwordData.newPassword) && (
                        <FaCheck className="text-white text-[10px]" />
                      )}
                    </motion.div>
                    <span className={`text-xs ${/[a-z]/.test(passwordData.newPassword) ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                      Lowercase
                    </span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5"
                  >
                    <motion.div
                      animate={/[A-Z]/.test(passwordData.newPassword) ? { scale: [1, 1.2, 1] } : {}}
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${/[A-Z]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      {/[A-Z]/.test(passwordData.newPassword) && (
                        <FaCheck className="text-white text-[10px]" />
                      )}
                    </motion.div>
                    <span className={`text-xs ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                      Uppercase
                    </span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5"
                  >
                    <motion.div
                      animate={/[0-9]/.test(passwordData.newPassword) ? { scale: [1, 1.2, 1] } : {}}
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${/[0-9]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      {/[0-9]/.test(passwordData.newPassword) && (
                        <FaCheck className="text-white text-[10px]" />
                      )}
                    </motion.div>
                    <span className={`text-xs ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                      Number
                    </span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 col-span-2"
                  >
                    <motion.div
                      animate={passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword ? { scale: [1, 1.2, 1] } : {}}
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      {passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword && (
                        <FaCheck className="text-white text-[10px]" />
                      )}
                    </motion.div>
                    <span className={`text-xs ${passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                      Passwords match
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Setting Password...</span>
                  </>
                ) : (
                  <>
                    <FaKey className="w-3.5 h-3.5" />
                    <span>Set Password</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          variants={itemVariants}
          className="text-center text-gray-500 text-xs mt-3 sm:mt-4 bg-white/80 backdrop-blur-sm py-2 px-3 rounded-lg shadow-sm"
        >
          <FaMobile className="inline w-3 h-3 mr-1" />
          You can still login with Google after setting a password
        </motion.p>
      </div>
    </motion.div>
  );
};

export default SetPassword;