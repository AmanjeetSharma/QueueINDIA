import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaUser,
  FaBuilding,
  FaHeadset,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaArrowLeft,
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle
} from "react-icons/fa";
import { MdOutlineSupportAgent, MdOutlineEmail } from "react-icons/md";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    subject: '',
    message: '',
    contactType: 'general'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const contactTypes = [
    { id: 'general', label: 'General Inquiry', icon: FaHeadset },
    { id: 'partnership', label: 'Partnership', icon: FaBuilding },
    { id: 'support', label: 'Technical Support', icon: MdOutlineSupportAgent },
    { id: 'feedback', label: 'Feedback', icon: MdOutlineEmail }
  ];

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Phone Support',
      details: ['1800-123-4567', '+91 98765 43210'],
      description: 'Available Mon-Fri, 9AM-6PM',
      color: 'from-blue-500 to-cyan-500',
      mobileColor: 'bg-blue-50 border-blue-100'
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: ['support@queueindia.com', 'partnerships@queueindia.com'],
      description: 'Response within 24 hours',
      color: 'from-purple-500 to-pink-500',
      mobileColor: 'bg-purple-50 border-purple-100'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Office',
      details: ['Tech Park, Sector 62', 'Noida, Uttar Pradesh 201309'],
      description: 'Visit by appointment',
      color: 'from-green-500 to-emerald-500',
      mobileColor: 'bg-green-50 border-green-100'
    },
    {
      icon: FaClock,
      title: 'Working Hours',
      details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM'],
      description: 'Closed on Sundays & Holidays',
      color: 'from-orange-500 to-red-500',
      mobileColor: 'bg-orange-50 border-orange-100'
    }
  ];

  const faqs = [
    {
      id: 1,
      question: "How quickly will I get a response?",
      answer: "General inquiries: Within 24 hours. Technical support: Within 4 hours during business hours. Partnership requests: Within 48 hours."
    },
    {
      id: 2,
      question: "Do you offer on-site support?",
      answer: "Yes, we provide on-site technical support and training for government departments in major cities. Contact us for scheduling."
    },
    {
      id: 3,
      question: "What information should I provide for partnership?",
      answer: "Please include your department name, contact person details, number of services offered, and approximate monthly citizen traffic."
    },
    {
      id: 4,
      question: "Is there emergency support available?",
      answer: "Yes, we offer 24/7 emergency support for critical system issues. Call our emergency hotline: +91 98765 43211"
    },
    {
      id: 5,
      question: "What are your business hours?",
      answer: "Our support team is available Monday to Friday from 9AM to 6PM, and Saturdays from 10AM to 4PM. Emergency support is available 24/7."
    },
    {
      id: 6,
      question: "How do I track my support ticket?",
      answer: "Once you submit a support request, you'll receive a ticket number via email. You can use this to track the status through our support portal."
    },
    {
      id: 7,
      question: "Do you provide training for department staff?",
      answer: "Yes, we offer comprehensive training programs for government department staff. This includes both online sessions and on-site workshops."
    },
    {
      id: 8,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, net banking, UPI payments, and bank transfers for government department partnerships."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        department: '',
        subject: '',
        message: '',
        contactType: 'general'
      });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Back Button */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={goBack}
            className="absolute left-4 sm:left-6 top-6 flex items-center gap-2 text-white hover:text-blue-100 transition-colors group"
          >
            <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium hidden sm:inline">Go Back</span>
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-8 px-4">
              We're here to help. Contact us for support, partnerships, or any questions about QueueIndia.
            </p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30"
            >
              <FaWhatsapp className="w-5 h-5" />
              <span className="font-medium">Quick Chat: +91 98765 43210</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
        {/* Contact Cards Grid */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How Can We Help You?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto px-4">
              Choose your preferred contact method
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`${info.mobileColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 border hover:shadow-lg transition-all`}
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${info.color} mb-4`}>
                  <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 sm:mb-3">{info.title}</h3>
                <div className="space-y-1 mb-3">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-gray-600">{detail}</p>
                  ))}
                </div>
                <p className="text-xs text-gray-500">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-gray-200 shadow-lg"
          >
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Send us a Message
              </h3>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex p-4 rounded-full bg-green-100 mb-4">
                  <FaCheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h4>
                <p className="text-gray-600 mb-6">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Contact Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I'm contacting about:
                  </label>
                  <div className="flex overflow-x-auto pb-2 -mx-1 sm:mx-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
                    {contactTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, contactType: type.id }))}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-lg border transition-all m-1 sm:m-0 ${
                          formData.contactType === type.id
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                        }`}
                      >
                        <type.icon className="w-4 h-4" />
                        <span className="text-sm font-medium whitespace-nowrap">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department/Organization
                    </label>
                    <div className="relative">
                      <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Transport Department"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                >
                  <FaPaperPlane className="w-4 h-4" />
                  Send Message
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Contact Information Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Quick Support */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 sm:p-6 border border-blue-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Support</h4>
              <div className="space-y-3">
                <a 
                  href="tel:18001234567"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <FaPhone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Call Now</div>
                    <div className="text-sm text-gray-600">1800-123-4567</div>
                  </div>
                </a>
                
                <a 
                  href="mailto:support@queueindia.com"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <FaEnvelope className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Email Support</div>
                    <div className="text-sm text-gray-600">support@queueindia.com</div>
                  </div>
                </a>
                
                <a 
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <FaWhatsapp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">WhatsApp</div>
                    <div className="text-sm text-gray-600">+91 98765 43210</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 sm:p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h4>
              <div className="flex items-center gap-3">
                {[
                  { icon: FaTwitter, color: 'text-blue-400', bg: 'bg-blue-50', label: 'Twitter' },
                  { icon: FaFacebook, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Facebook' },
                  { icon: FaLinkedin, color: 'text-blue-700', bg: 'bg-blue-50', label: 'LinkedIn' },
                  { icon: FaInstagram, color: 'text-pink-600', bg: 'bg-pink-50', label: 'Instagram' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    whileHover={{ y: -2 }}
                    href="#"
                    className={`${social.bg} w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity`}
                    aria-label={social.label}
                  >
                    <social.icon className={`w-5 h-5 ${social.color}`} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-gray-200 shadow-lg mb-8 sm:mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: faq.id * 0.05 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FaQuestionCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      {faq.question}
                    </h3>
                  </div>
                  {expandedFaq === faq.id ? (
                    <FaChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  ) : (
                    <FaChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {expandedFaq === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                      <div className="pl-11 sm:pl-12">
                        <p className="text-gray-600 text-sm sm:text-base">{faq.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* FAQ Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-5 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 text-center"
          >
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              Still have questions?
            </h4>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Our support team is ready to help.
            </p>
            <a 
              href="#contact-form"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaHeadset className="w-4 h-4" />
              Contact Support Team
            </a>
          </motion.div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          id="contact-form"
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white text-center"
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-4">
            Need Immediate Assistance?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our dedicated support team is available around the clock to help you.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-sm text-blue-200">Emergency Support</div>
            </div>
            <div className="p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold mb-1">4hrs</div>
              <div className="text-sm text-blue-200">Response Time</div>
            </div>
            <div className="p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold mb-1">99%</div>
              <div className="text-sm text-blue-200">Satisfaction Rate</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="tel:+919876543211"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:shadow-xl transition-shadow"
            >
              <FaPhone className="w-4 h-4" />
              Call Emergency: +91 98765 43211
            </a>
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, contactType: 'support' }));
                document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              Create Support Ticket
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;