import { motion } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaBuilding,
  FaClipboardList,
  FaCalendarAlt,
  FaClock,
  FaFileAlt,
  FaCheckCircle,
  FaPhone,
  FaHandshake,
  FaArrowRight,
  FaUpload,
  FaUserCheck,
  FaMobileAlt,
  FaQrcode
} from "react-icons/fa";

const HowThingsWork = () => {
  const containerRef = useRef(null);

  const steps = [
    {
      number: 1,
      title: "Search & Explore",
      description: "Browse government departments and services",
      icon: FaSearch,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      details: ["View all departments", "Check available services", "Filter by location"]
    },
    {
      number: 2,
      title: "Select Department",
      description: "Choose the department for your service",
      icon: FaBuilding,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      details: ["Department overview", "Available services", "Processing times"]
    },
    {
      number: 3,
      title: "Choose Service",
      description: "Pick the exact service you need",
      icon: FaClipboardList,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      details: ["Service requirements", "Documents checklist", "Fees and timelines"]
    },
    {
      number: 4,
      title: "Select Date",
      description: "Choose appointment date",
      icon: FaCalendarAlt,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      details: ["Availability calendar", "Holiday indicators", "Peak hour info"]
    },
    {
      number: 5,
      title: "Pick Time Slot",
      description: "Select preferred time slot",
      icon: FaClock,
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      details: ["30-minute slots", "Live availability", "Wait times"]
    },
    {
      number: 6,
      title: "Provide Details",
      description: "Fill personal information",
      icon: FaFileAlt,
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      details: ["Secure form", "Auto-save", "Review before submit"]
    },
    {
      number: 7,
      title: "Confirm Booking",
      description: "Review and confirm appointment",
      icon: FaCheckCircle,
      color: "from-teal-500 to-green-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      details: ["Booking summary", "Token generation", "Email/SMS confirmation"]
    },
    {
      number: 8,
      title: "Manage Bookings",
      description: "Track and manage appointments",
      icon: FaUserCheck,
      color: "from-gray-500 to-gray-700",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      details: ["View appointments", "Upload documents", "Reschedule/cancel"]
    }
  ];

  const features = [
    {
      icon: FaUpload,
      title: "Document Upload",
      description: "Secure document upload after booking"
    },
    {
      icon: FaMobileAlt,
      title: "Mobile Notifications",
      description: "SMS and app notifications"
    },
    {
      icon: FaQrcode,
      title: "QR Check-in",
      description: "Get a QR code for easy on-ground check-in"
    }
  ];

  const partnerSteps = [
    { step: 1, title: "Initial Inquiry", description: "Contact for partnership" },
    { step: 2, title: "Requirements Analysis", description: "Analyze department needs" },
    { step: 3, title: "Integration Setup", description: "Technical setup" },
    { step: 4, title: "Training & Launch", description: "Staff training and launch" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" ref={containerRef}>
      {/* Hero Section - Compact */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              How <span className="text-blue-600">QueueIndia</span> Works
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
              Seamless journey from searching departments to booking appointments.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/departments"
                className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all text-sm sm:text-base"
              >
                Start Exploring
                <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Steps Section - More Compact */}
      <div className="relative overflow-hidden">
        {/* Subtle Animated Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #3b82f6 0px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
          {/* Steps List - Compact Mobile Layout */}
          <div className="space-y-6 sm:space-y-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative"
              >
                {/* Connecting Line - Hidden on smallest screens */}
                {index < steps.length - 1 && (
                  <div className="hidden sm:block absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-blue-300/50 to-transparent" />
                )}

                <div className="flex items-start gap-4 sm:gap-6">
                  {/* Step Number - Compact */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`relative flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg`}
                  >
                    {step.number}
                  </motion.div>

                  {/* Step Content - Compact */}
                  <div className={`flex-1 p-4 sm:p-5 rounded-xl border ${step.borderColor} ${step.bgColor} backdrop-blur-sm`}>
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <step.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{
                        color: step.color.includes('blue') ? '#3b82f6' :
                          step.color.includes('purple') ? '#8b5cf6' :
                            step.color.includes('green') ? '#10b981' :
                              step.color.includes('orange') ? '#f97316' :
                                step.color.includes('yellow') ? '#f59e0b' :
                                  step.color.includes('indigo') ? '#6366f1' :
                                    step.color.includes('teal') ? '#14b8a6' : '#6b7280'
                      }} />
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                    <ul className="space-y-1">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 rounded-full" style={{
                            backgroundColor: step.color.includes('blue') ? '#3b82f6' :
                              step.color.includes('purple') ? '#8b5cf6' :
                                step.color.includes('green') ? '#10b981' :
                                  step.color.includes('orange') ? '#f97316' :
                                    step.color.includes('yellow') ? '#f59e0b' :
                                      step.color.includes('indigo') ? '#6366f1' :
                                        step.color.includes('teal') ? '#14b8a6' : '#6b7280'
                          }} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Features Section - Compact Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 sm:mt-12 relative z-10"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              Additional Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="p-4 sm:p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 sm:mb-4">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">{feature.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA - Compact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-8 sm:mt-10 p-6 sm:p-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white text-center relative overflow-hidden"
          >
            <div className="relative z-10">
              <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Want to open a department?</h4>
              <p className="text-blue-100 text-sm sm:text-base mb-4 max-w-md mx-auto">
                Partner with us to digitize your services and reach more citizens effortlessly.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-lg transition-shadow text-sm sm:text-base"
                >
                  Explore Partnership, Benefits & pricing
                  <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Partnership Section - Compact */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Want Your Department on <span className="text-blue-400">QueueIndia</span>?
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
              Join our network providing seamless online services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Partnership Steps */}
            <div className="space-y-6 sm:space-y-8">
              {partnerSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3 sm:gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-base sm:text-lg">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-300">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Form - Compact */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-white/20"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Contact Partnership Team</h3>
              <form className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Department Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Department name"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Contact Person</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Contact person"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="official@department.gov.in"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Message</label>
                  <textarea
                    rows="3"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Tell us about your department..."
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:shadow-lg transition-shadow text-sm sm:text-base"
                >
                  Request Partnership
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Contact Info - Compact Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center"
          >
            <div className="p-4 sm:p-5 bg-white/5 rounded-xl border border-white/10">
              <FaPhone className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2 sm:mb-3" />
              <h4 className="font-bold text-sm sm:text-base mb-1">Call Us</h4>
              <p className="text-gray-300 text-xs sm:text-sm">1800-123-4567</p>
              <p className="text-gray-400 text-xs mt-1">Mon-Fri, 9AM-6PM</p>
            </div>
            <div className="p-4 sm:p-5 bg-white/5 rounded-xl border border-white/10">
              <FaHandshake className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-2 sm:mb-3" />
              <h4 className="font-bold text-sm sm:text-base mb-1">Email</h4>
              <p className="text-gray-300 text-xs sm:text-sm">partnerships@queueindia.com</p>
              <p className="text-gray-400 text-xs mt-1">Response in 24h</p>
            </div>
            <div className="p-4 sm:p-5 bg-white/5 rounded-xl border border-white/10">
              <FaBuilding className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2 sm:mb-3" />
              <h4 className="font-bold text-sm sm:text-base mb-1">Office</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Tech Park, Sector 62</p>
              <p className="text-gray-400 text-xs mt-1">Noida, Uttar Pradesh</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Final CTA - Compact */}
      <div className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Experience Hassle-Free Government Services
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Join thousands who simplified their government service experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/departments"
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all text-sm sm:text-base"
                >
                  Start Your Journey
                  <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-50 transition-all text-sm sm:text-base"
                >
                  Contact Support
                  <FaPhone className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HowThingsWork;