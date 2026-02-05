import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaLock, FaShieldAlt, FaDatabase, FaEye, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const PrivacyPolicy = () => {
  const [expandedSection, setExpandedSection] = useState(0);

  const sections = [
    {
      id: 1,
      title: "Information We Collect",
      icon: FaDatabase,
      content: `We collect various types of information to provide and improve our services:
      
      • Personal Information: Name, email, phone number, address provided during registration
      • Government ID: Aadhaar, PAN, Voter ID for verification purposes
      • Appointment Details: Booking history, service requests, document uploads
      • Device Information: Browser type, IP address, device type, operating system
      • Usage Analytics: Pages visited, time spent, features accessed (non-identifying)`
    },
    {
      id: 2,
      title: "How We Use Your Information",
      icon: FaEye,
      content: `Your data is used exclusively to:
      
      • Process and manage your government service appointments
      • Send appointment confirmations, reminders via SMS/Email
      • Verify your identity and prevent unauthorized access
      • Improve our platform performance and user experience
      • Comply with government regulations and audit requirements
      • Detect and prevent fraudulent activities
      
      We do NOT sell or share your data with third parties without explicit consent.`
    },
    {
      id: 3,
      title: "Data Security",
      icon: FaLock,
      content: `Security is our top priority:
      
      • End-to-end encryption for all data transmission (SSL/TLS)
      • AES-256 encryption for stored personal information
      • Multi-factor authentication for account protection
      • Regular security audits by third-party experts
      • PCI DSS compliance for payment processing
      • Data centers with 99.99% uptime SLA
      • Automatic backup and disaster recovery systems
      
      We maintain industry-leading security standards aligned with ISO 27001 certification.`
    },
    {
      id: 4,
      title: "Your Rights",
      icon: FaShieldAlt,
      content: `Under DPDP Act 2023, you have the right to:
      
      • Access: Request a copy of your personal data
      • Correction: Update inaccurate or incomplete information
      • Deletion: Request deletion of your data (right to be forgotten)
      • Portability: Get your data in a machine-readable format
      • Objection: Opt-out of non-essential communications
      
      To exercise these rights, contact our Data Protection Officer at privacy@queueindia.com`
    },
    {
      id: 5,
      title: "Cookies & Tracking",
      icon: FaEye,
      content: `We use cookies to enhance your experience:
      
      • Essential Cookies: Required for login and session management
      • Analytics Cookies: Help us understand user behavior (anonymized)
      • Preference Cookies: Remember your settings and preferences
      
      You can disable non-essential cookies in your browser settings without affecting core functionality.`
    },
    {
      id: 6,
      title: "Third-Party Services",
      icon: FaArrowRight,
      content: `We use trusted third parties:
      
      • Google Analytics: For anonymized usage statistics
      • Stripe/Razorpay: For secure payment processing
      • AWS: For secure cloud infrastructure
      • Twilio: For SMS notifications
      
      All third parties are bound by strict data protection agreements and DPDP compliance.`
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <FaLock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Privacy Policy</h1>
            <p className="text-slate-600 text-sm mt-1">Last updated: January 2024</p>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-slate-700 max-w-3xl leading-relaxed"
        >
          At QueueIndia, we're committed to protecting your privacy and ensuring transparency about how we handle your personal information. This policy outlines our practices in accordance with the Digital Personal Data Protection Act, 2023.
        </motion.p>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        {/* Key Highlights */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          {[
            { icon: FaLock, title: "256-bit Encryption", desc: "Bank-level data protection" },
            { icon: FaShieldAlt, title: "ISO 27001", desc: "International security certified" },
            { icon: FaDatabase, title: "No Data Sale", desc: "Your data is never sold" },
            { icon: FaCheckCircle, title: "DPDP Compliant", desc: "Full legal compliance" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="p-4 sm:p-5 bg-white rounded-xl border border-blue-100/50 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Accordion Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-3 sm:space-y-4"
        >
          {sections.map((section, idx) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === idx;

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(isExpanded ? -1 : idx)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-blue-50/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">{section.title}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-100"
                    >
                      <div className="px-5 sm:px-6 py-4 sm:py-5 text-slate-700 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                        {section.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Questions About Your Privacy?</h3>
          <p className="text-slate-700 mb-6">Our Admins are there to help.</p>
          <div className="space-y-3">
            <p className="text-slate-700">
              <span className="font-semibold">Email:</span>{" "}
              <a href="mailto:privacy@queueindia.com" className="text-blue-600 hover:text-blue-700 font-medium">
                privacy@queueindia.com
              </a>
            </p>
            <p className="text-slate-700">
              <span className="font-semibold">Response Time:</span> 5 business days
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;