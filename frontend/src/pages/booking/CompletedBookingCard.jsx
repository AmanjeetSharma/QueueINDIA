import React, { useEffect, useRef } from 'react';
import { CheckCircle, Calendar, Clock, FileText, Award, PartyPopper, Download, Eye, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const CompletedBookingCard = ({ booking = {
  date: new Date().toISOString(),
  service: { name: 'Document Verification' },
  slotTime: '10:00-11:00',
  tokenNumber: '12345'
} }) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const formattedDate = booking?.date ? new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : '';

  useEffect(() => {
    const cards = cardsRef.current;
    const handleMouseEnter = (card) => {
      card.style.transform = 'translateY(-4px)';
      card.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.15)';
    };

    const handleMouseLeave = (card) => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
    };

    cards.forEach((card) => {
      if (!card) return;
      card.addEventListener('mouseenter', () => handleMouseEnter(card));
      card.addEventListener('mouseleave', () => handleMouseLeave(card));
    });

    return () => {
      cards.forEach((card) => {
        if (!card) return;
        card.removeEventListener('mouseenter', () => handleMouseEnter(card));
        card.removeEventListener('mouseleave', () => handleMouseLeave(card));
      });
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  const ConfettiPiece = ({ delay, duration }) => (
    <motion.div
      className="fixed pointer-events-none z-0"
      style={{
        left: Math.random() * window.innerWidth,
        top: -10,
        width: '8px',
        height: '8px',
        backgroundColor: ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
        borderRadius: Math.random() > 0.5 ? '50%' : '0'
      }}
      initial={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
      animate={{
        opacity: 0,
        y: window.innerHeight + 100,
        x: (Math.random() - 0.5) * 200,
        rotate: Math.random() * 360
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: 'easeIn'
      }}
    />
  );

  return (
    <div className="min-h-screen p-4 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white">
      {/* Subtle Confetti */}
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiPiece key={i} delay={i * 0.03} duration={Math.random() * 1 + 2} />
      ))}

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl"
      >
        {/* Main Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-emerald-100">
          {/* Header Section */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="relative inline-block mb-5">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto relative z-10 shadow-lg shadow-emerald-200"
                animate={{
                  scale: [1, 1.03, 1],
                  boxShadow: [
                    '0 0 20px rgba(16, 185, 129, 0.3)',
                    '0 0 30px rgba(16, 185, 129, 0.4)',
                    '0 0 20px rgba(16, 185, 129, 0.3)'
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <CheckCircle className="text-white" size={36} />
              </motion.div>

              <motion.div
                className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-sm"
                animate={{
                  y: [-5, 0, -5],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{
                  y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 1, repeat: Infinity }
                }}
              >
                <PartyPopper className="text-white" size={14} />
              </motion.div>

              <motion.div
                className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm"
                animate={{
                  y: [5, 0, 5],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
                  rotate: { duration: 1.2, repeat: Infinity, delay: 0.2 }
                }}
              >
                <Award className="text-white" size={12} />
              </motion.div>
            </div>

            <motion.h2
              className="text-2xl font-bold text-gray-800 mb-2"
              variants={itemVariants}
            >
              Service Completed! 🎉
            </motion.h2>
            <motion.p
              className="text-gray-600 text-sm"
              variants={itemVariants}
            >
              Your <span className="font-semibold text-emerald-600">{booking.service?.name}</span> has been processed successfully.
            </motion.p>
          </motion.div>

          {/* Info Cards - Compact Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {[ 
              { icon: Calendar, label: 'Service Date', value: formattedDate },
              { icon: Clock, label: 'Service Time', value: booking.slotTime?.replace('-', ' - ') },
              { icon: FileText, label: 'Token Number', value: `#${booking.tokenNumber}`, isToken: true }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                ref={el => cardsRef.current[idx] = el}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <item.icon size={18} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                    <p className={`${item.isToken ? 'text-xl font-bold' : 'text-base font-semibold'} text-gray-800 truncate`}>
                      {item.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* What's Next Section */}
          <motion.div
            className="mb-8"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-20px' }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">What's Next?</h3>
            <div className="space-y-3">
              {[ 
                'Service request processed and marked as completed',
                'Access service documents from your dashboard',
                `Keep token #${booking.tokenNumber} for reference`,
                'Contact department for certificates or documents'
              ].map((text, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={10} className="text-emerald-600" />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons - Compact */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-3"
          >
            <motion.button
              variants={itemVariants}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Download size={18} />
              Download Service Certificate
            </motion.button>
            
            <div className="grid grid-cols-2 gap-3">
              {[ 
                { icon: Eye, label: 'View Details' },
                { icon: MessageSquare, label: 'Feedback' }
              ].map((btn, idx) => (
                <motion.button
                  key={idx}
                  variants={itemVariants}
                  className="border-2 border-emerald-200 text-emerald-700 rounded-xl py-3 font-medium text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all duration-200"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <btn.icon size={16} />
                  {btn.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-gray-400 mt-4"
        >
          Need help? Contact support@serviceportal.com
        </motion.p>
      </motion.div>
    </div>
  );
};

export default CompletedBookingCard;