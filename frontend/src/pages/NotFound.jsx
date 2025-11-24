import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaArrowLeft, FaCompass, FaRocket } from "react-icons/fa";

const NotFound = () => {
    const floatingElements = [
        { icon: "🔍", delay: 0 },
        { icon: "🚀", delay: 0.5 },
        { icon: "🌟", delay: 1 },
        { icon: "💫", delay: 1.5 },
        { icon: "🔮", delay: 2 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {floatingElements.map((element, index) => (
                    <motion.div
                        key={index}
                        className="absolute text-2xl opacity-20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            delay: element.delay,
                        }}
                    >
                        {element.icon}
                    </motion.div>
                ))}

                {/* Gradient Orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                    }}
                />
            </div>

            <div className="text-center relative z-10 max-w-2xl mx-auto">
                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8"
                >
                    {/* Animated 404 Number */}
                    <div className="relative">
                        <motion.h1
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                            className="text-9xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                        >
                            404
                        </motion.h1>

                        {/* Floating particles around 404 */}
                        <motion.div
                            className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full"
                            animate={{
                                y: [0, -10, 0],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 0.5,
                            }}
                        />
                        <motion.div
                            className="absolute -bottom-2 -left-4 w-6 h-6 bg-pink-400 rounded-full"
                            animate={{
                                y: [0, 8, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: 1,
                            }}
                        />
                    </div>

                    {/* Main Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="space-y-4"
                    >
                        <h2 className="text-4xl font-bold text-gray-900">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
                            The page you're looking for seems to have drifted off into the digital cosmos.
                            Let's get you back on track!
                        </p>
                    </motion.div>

                    {/* Animated Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="relative w-48 h-48 mx-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl transform rotate-45"></div>
                        <motion.div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <FaCompass className="w-16 h-16 text-indigo-600" />
                        </motion.div>
                        <motion.div
                            className="absolute top-4 right-4"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            <div className="w-8 h-8 border-2 border-dashed border-blue-300 rounded-full"></div>
                        </motion.div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/"
                                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                                <FaHome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Back to Home
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                                <FaArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                Go Back
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="pt-8 border-t border-gray-200 mt-8"
                    >
                        <p className="text-gray-500 mb-4">Quick Navigation</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {[
                                { to: "/services", label: "Services", icon: FaRocket },
                                { to: "/departments", label: "Departments", icon: FaCompass },
                                { to: "/pricing", label: "Pricing", icon: FaSearch },
                            ].map((link, index) => (
                                <motion.div
                                    key={link.to}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                                >
                                    <Link
                                        to={link.to}
                                        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-gray-100"
                                    >
                                        <link.icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{link.label}</span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Fun Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="pt-6"
                    >
                        <p className="text-gray-400 text-sm italic">
                            "Not all who wander are lost, but you might be... Let's find your way back!"
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Decoration */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">QueueINDIA • Your Digital Queue Solution</span>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;