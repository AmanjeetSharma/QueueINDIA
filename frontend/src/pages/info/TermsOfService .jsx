import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaFileContract, FaChevronDown, FaUser, FaGavel, FaCoins, FaHandshake, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";


const TermsOfService = () => {
  const [expandedSection, setExpandedSection] = useState(0);

  const sections = [
    {
      id: 1,
      title: "Acceptance of Terms",
      icon: FaHandshake,
      content: `By accessing and using QueueIndia, you accept and agree to be bound by the terms and provision of this agreement.

If you do not agree to abide by the above, please do not use this service.

• These Terms apply to all users of the QueueIndia platform
• We reserve the right to modify these terms at any time
• Continued use of the service constitutes acceptance of updated terms
• Users will be notified of significant changes via email`
    },
    {
      id: 2,
      title: "User Responsibilities",
      icon: FaUser,
      content: `As a user, you agree to:

• Provide accurate and complete information during registration
• Maintain confidentiality of your account credentials
• Use the platform only for legitimate government service bookings
• Not engage in fraudulent or illegal activities
• Comply with all applicable laws and regulations
• Not attempt to hack, breach, or attack the platform
• Respect other users' rights and privacy
• Not upload malicious content or viruses
• Not use automated systems to scrape or access the platform`
    },
    {
      id: 3,
      title: "Appointment Booking",
      icon: FaCheckCircle,
      content: `Understanding our booking policy:

Cancellation & Rescheduling:
• Free cancellation/reschedule up to 24 hours before appointment
• Cancellations within 24 hours may incur penalties as per department rules
• No-show without cancellation may result in account restrictions

Documentation:
• You are responsible for submitting required documents
• Incomplete documentation may result in appointment cancellation
• Lost documents or delays are not our responsibility

Appointment Confirmation:
• Confirmation is sent via SMS and email
• Check-in timing and location details are provided in confirmation
• Arrive 15 minutes early for smooth processing`
    },
    {
      id: 4,
      title: "Payment & Fees",
      icon: FaCoins,
      content: `Transparency in pricing:

• QueueIndia charges nominal service fees (varies by service)
• All fees are clearly displayed before booking confirmation
• Government service charges are additional and set by respective departments
• Accepted payment methods: Credit/Debit cards, UPI, Net Banking
• Payment failures will not complete your booking
• Refunds are processed within 5-7 business days to original payment source
• No hidden charges or surprise fees

Tax Compliance:
• All payments include applicable GST
• Invoice is provided for all transactions
• For business inquiries, contact billing@queueindia.com`
    },
    {
      id: 5,
      title: "Intellectual Property",
      icon: FaFileContract,
      content: `Protecting our platform:

• All content on QueueIndia (code, design, text, images) is owned by QueueIndia
• You may not reproduce, distribute, or transmit any content without permission
• User-uploaded documents remain your property but you grant us license to process them
• Trademarks and logos are protected intellectual property
• Unauthorized use may result in legal action
• Fair use policies allow personal, non-commercial use only`
    },
    {
      id: 6,
      title: "Limitation of Liability",
      icon: IoIosWarning,
      content: `Our liability limits:

• QueueIndia is provided "as-is" without warranties
• We're not liable for service disruptions due to government systems failures
• We're not responsible for lost, stolen, or damaged documents
• Maximum liability is limited to fees paid in the last 12 months
• We're not liable for indirect, incidental, or consequential damages
• Users use the platform at their own risk

Service Interruptions:
• We may temporarily suspend service for maintenance (with notice)
• No liability for unavailability during government system maintenance
• We aim for 99.9% uptime but cannot guarantee 100% availability`
    },
    {
      id: 7,
      title: "Prohibited Activities",
      icon: FaGavel,
      content: `You may not:

• Create multiple accounts to circumvent restrictions
• Attempt to bypass security measures
• Harass, threaten, or abuse other users or staff
• Share your account with others
• Use the platform for illegal purposes
• Upload adult content or hate speech
• Spam or flood the system with requests
• Exploit vulnerabilities in the platform
• Engage in phishing or social engineering
• Impersonate government officials or staff

Violations may result in:
• Account suspension or permanent ban
• Reporting to law enforcement (if illegal)
• Legal action to recover damages`
    },
    {
      id: 8,
      title: "Dispute Resolution",
      icon: FaHandshake,
      content: `Handling disagreements:

Grievance Process:
• Submit complaints via grievance@queueindia.com
• Response within 5 business days
• Appeal process available if not satisfied
• Escalation to senior management for complex cases

Mediation:
• Both parties agree to attempt mediation before litigation
• Mediation conducted by neutral third party
• Mediation costs shared equally

Legal Jurisdiction:
• These terms governed by laws of India
• Disputes shall be subject to exclusive jurisdiction of courts in Delhi
• Applicable laws: Indian Penal Code, Consumer Protection Act, DPDP Act 2023`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background */}
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
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <FaFileContract className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Terms of Service</h1>
            <p className="text-slate-600 text-sm mt-1">Last updated: January 2024</p>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-slate-700 max-w-3xl leading-relaxed"
        >
          These Terms of Service govern your use of QueueIndia and the services we provide. Please read carefully before creating an account or making any bookings.
        </motion.p>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          {[
            { label: "Service Fee", value: "₹0-1000 (Depending on service)" },
            { label: "Refund Period", value: "within a week" },
            { label: "Response Time", value: "3 working days" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200 text-center"
            >
              <p className="text-slate-600 text-xs sm:text-sm mb-1">{stat.label}</p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Accordion */}
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
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-purple-50/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
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

        {/* Acceptance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">By using QueueIndia, you acknowledge:</h3>
          <ul className="space-y-3">
            {[
              "You have read and understood these Terms of Service",
              "You agree to comply with all applicable laws",
              "You accept our Privacy Policy and data handling practices",
              "You understand our liability limitations",
              "You will use the platform responsibly and legally"
            ].map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.05 }}
                className="flex items-start gap-3"
              >
                <FaCheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 p-6 sm:p-8 bg-white rounded-xl border border-slate-200 text-center"
        >
          <p className="text-slate-700 mb-3">Questions about these terms?</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Contact Legal Team
            <FaArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;