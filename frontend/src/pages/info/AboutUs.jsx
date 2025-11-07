import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Team Member Component
const TeamMember = ({ name, role, bio, image, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start space-x-6">
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-2xl font-bold text-indigo-600">
            {name.split(' ').map(n => n[0]).join('')}
          </span>
        </motion.div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <p className="text-indigo-600 font-semibold mt-1">{role}</p>
          <p className="text-gray-600 mt-3 leading-relaxed">{bio}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Stat Counter Component
const StatCounter = ({ number, label, suffix = "+", delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <motion.div
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: delay + 0.2, type: "spring", stiffness: 100 }}
      >
        {number}{suffix}
      </motion.div>
      <p className="text-gray-600 mt-2 font-medium">{label}</p>
    </motion.div>
  );
};

// Value Card Component
const ValueCard = ({ title, description, icon, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
    >
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
        whileHover={{ rotate: 5 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50">
      {/* Header Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-5xl sm:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  About QueueINDIA
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 mt-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                We're revolutionizing queue management across India, making waiting in lines
                a thing of the past. Our mission is to transform customer experiences through
                innovative technology and thoughtful design.
              </motion.p>

              <motion.div
                className="mt-8 flex items-center space-x-4 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600 font-medium">Founded in 2025</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600 font-medium">Based in Jalandhar</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 border border-gray-200 shadow-2xl">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    background: [
                      "radial-gradient(circle at 30% 70%, rgba(199, 210, 254, 0.4) 0%, transparent 50%)",
                      "radial-gradient(circle at 70% 30%, rgba(199, 210, 254, 0.4) 0%, transparent 50%)",
                      "radial-gradient(circle at 30% 70%, rgba(199, 210, 254, 0.4) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />

                {/* Animated elements representing queue management */}
                <div className="relative z-10 w-4/5 h-4/5 flex items-center justify-center">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <motion.div
                      key={item}
                      className="absolute bg-white rounded-2xl shadow-lg border border-gray-200 p-4"
                      style={{
                        width: `${100 - item * 10}%`,
                        height: `${100 - item * 10}%`,
                      }}
                      animate={{
                        rotate: [0, 5, 0, -5, 0],
                        scale: [1, 1.02, 1, 1.02, 1],
                      }}
                      transition={{
                        duration: 6,
                        delay: item * 0.5,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforming queue management for businesses and customers across India
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter number={500} label="Businesses Served" delay={0.1} />
            <StatCounter number={50} label="Cities" delay={0.2} />
            <StatCounter number={2} label="Million+ Customers" suffix="M+" delay={0.3} />
            <StatCounter number={99} label="Satisfaction Rate" suffix="%" delay={0.4} />
          </div>
        </div>
      </section> */}



      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Join the Queue Revolution?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Be part of the movement that's transforming customer experiences across India.
            </p>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;