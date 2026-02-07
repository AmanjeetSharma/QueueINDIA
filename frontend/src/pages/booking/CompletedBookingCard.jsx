import React, { useEffect, useRef } from 'react';
import { CheckCircle, Calendar, Clock, FileText, Award, PartyPopper, Download, Eye, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const CompletedBookingCard = ({ booking = {
  date: new Date().toISOString(),
  service: { name: 'Document Verification' },
  slotTime: '10:00-11:00'
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
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const ConfettiPiece = ({ delay, duration }) => (
    <motion.div
      className="fixed pointer-events-none z-0"
      style={{
        left: Math.random() * window.innerWidth,
        top: -10,
        width: '6px',
        height: '6px',
        backgroundColor: ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
        borderRadius: Math.random() > 0.5 ? '50%' : '0'
      }}
      initial={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
      animate={{
        opacity: 0,
        y: window.innerHeight + 50,
        x: (Math.random() - 0.5) * 100,
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
    <div className="min-h-screen p-3 md:p-4 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white">
      {/* Subtle Confetti - Reduced count for mobile */}
      {Array.from({ length: window.innerWidth < 768 ? 15 : 25 }).map((_, i) => (
        <ConfettiPiece key={i} delay={i * 0.05} duration={Math.random() * 1 + 1.5} />
      ))}

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md md:max-w-lg"
      >
        {/* Main Card Container - More Compact */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border border-emerald-100">
          {/* Header Section */}
          <motion.div className="text-center mb-6" variants={itemVariants}>
            <div className="relative inline-block mb-4">
              <motion.div
                className="w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto relative z-10 shadow-md shadow-emerald-200"
                animate={{
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    '0 0 15px rgba(16, 185, 129, 0.25)',
                    '0 0 25px rgba(16, 185, 129, 0.35)',
                    '0 0 15px rgba(16, 185, 129, 0.25)'
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <CheckCircle className="text-white" size={28} />
              </motion.div>

              <motion.div
                className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-sm"
                animate={{
                  y: [-3, 0, -3],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{
                  y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 1, repeat: Infinity }
                }}
              >
                <PartyPopper className="text-white" size={12} />
              </motion.div>

              <motion.div
                className="absolute -bottom-1 -left-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm"
                animate={{
                  y: [3, 0, 3],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
                  rotate: { duration: 1.2, repeat: Infinity, delay: 0.2 }
                }}
              >
                <Award className="text-white" size={10} />
              </motion.div>
            </div>

            <motion.h2
              className="text-xl md:text-2xl font-bold text-gray-800 mb-1"
              variants={itemVariants}
            >
              Service Completed! 🎉
            </motion.h2>
            <motion.p
              className="text-gray-600 text-xs md:text-sm"
              variants={itemVariants}
            >
              Your <span className="font-semibold text-emerald-600">{booking.service?.name}</span> has been processed successfully.
            </motion.p>
          </motion.div>

          {/* Info Cards - Compact Grid for Mobile */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mb-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {[ 
              { 
                icon: Calendar, 
                label: 'Service Date', 
                value: formattedDate,
                description: 'Date of completion'
              },
              { 
                icon: Clock, 
                label: 'Service Time', 
                value: booking.slotTime?.replace('-', ' - ') || 'Not specified',
                description: 'Time slot'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                ref={el => cardsRef.current[idx] = el}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="bg-gradient-to-br from-emerald-50 to-white rounded-lg p-3 border border-emerald-100 shadow-sm hover:shadow transition-all duration-200"
              >
                <div className="flex items-start gap-2">
                  <div className="p-2 bg-emerald-100 rounded flex-shrink-0">
                    <item.icon size={16} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item.value}
                    </p>
                    {item.description && (
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* What's Next Section - More Compact */}
          <motion.div
            className="mb-6"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10px' }}
          >
            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3">What's Next?</h3>
            <div className="space-y-2">
              {[ 
                'Service request processed and marked as completed',
                'Access service documents from your dashboard',
                'Contact department for any certificates or documents',
                'Your feedback helps us improve our services'
              ].map((text, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -5 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-2"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={8} className="text-emerald-600" />
                    </div>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600 flex-1">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons - Mobile Optimized */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-2 md:space-y-3"
          >
            <motion.button
              variants={itemVariants}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg md:rounded-xl py-2.5 md:py-3 font-medium text-sm md:text-base flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={16} className="md:size-[18px]" />
              Download Certificate
            </motion.button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[ 
                { icon: Eye, label: 'View Details', variant: 'outline' },
                { icon: MessageSquare, label: 'Give Feedback', variant: 'outline' }
              ].map((btn, idx) => (
                <motion.button
                  key={idx}
                  variants={itemVariants}
                  className="border border-emerald-200 text-emerald-700 rounded-lg py-2.5 font-medium text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all duration-200 active:scale-[0.98]"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <btn.icon size={14} className="md:size-[16px]" />
                  {btn.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer Note - Smaller */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-gray-400 mt-3 md:mt-4"
        >
          Need help? Contact your department support
        </motion.p>
      </motion.div>
    </div>
  );
};

export default CompletedBookingCard;