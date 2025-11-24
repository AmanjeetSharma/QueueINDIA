import React from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Users,
    Shield,
    Star,
    ArrowRight,
    PlayCircle,
    CheckCircle2
} from 'lucide-react';

const Home = () => {
    const features = [
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "Easy Booking",
            description: "Book appointments in just a few clicks with our intuitive interface"
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "Real-time Updates",
            description: "Get live queue status and estimated waiting times"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Multi-service Support",
            description: "Book appointments for various services and departments"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Secure & Reliable",
            description: "Your data is protected with enterprise-grade security"
        }
    ];

    const stats = [
        { number: "50K+", label: "Happy Customers" },
        { number: "200+", label: "Partner Services" },
        { number: "95%", label: "Satisfaction Rate" },
        { number: "24/7", label: "Support Available" }
    ];

    const testimonials = [
        {
            name: "Priya Sharma",
            role: "Regular User",
            content: "queueINDIA saved me hours of waiting time. The app is incredibly easy to use!",
            rating: 5
        },
        {
            name: "Rahul Verma",
            role: "Business Owner",
            content: "Managing customer queues has never been easier. Highly recommended!",
            rating: 5
        },
        {
            name: "Anita Patel",
            role: "Student",
            content: "The real-time updates help me plan my day better. Fantastic service!",
            rating: 4
        }
    ];

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-700 opacity-10"></div>
                <div className="relative max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-800 mb-6">
                            Skip the Line,
                            <span className="block bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">Save Your Time</span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            India's premier queue management system. Book appointments, avoid waiting,
                            and manage your time efficiently.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
                            >
                                Get Started Now
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="border-2 border-gray-600 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 hover:border-blue-600 hover:text-blue-600 transition-colors"
                            >
                                <PlayCircle className="w-5 h-5" />
                                Watch Demo
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="text-center"
                            >
                                <div className="text-3xl sm:text-4xl font-bold text-blue-600">{stat.number}</div>
                                <div className="text-gray-600 mt-2">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Why Choose queueINDIA?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Experience the future of queue management with our comprehensive features
                            designed to make your life easier.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="text-blue-600 mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Get started in just three simple steps
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                                    {step}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {step === 1 && "Select Service & Book Slot"}
                                    {step === 2 && "Get Confirmation & QR Code"}
                                    {step === 3 && "Arrive & Get Served"}
                                </h3>
                                <p className="text-gray-600">
                                    {step === 1 && "Choose from various services and pick your preferred time slot"}
                                    {step === 2 && "Receive instant confirmation with your unique QR code"}
                                    {step === 3 && "Show your QR code and get served without waiting"}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            What Our Users Say
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join thousands of satisfied users who have transformed their waiting experience
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="bg-gray-50 p-8 rounded-2xl border border-gray-200"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                            Ready to Skip the Queue?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join queueINDIA today and experience the convenience of smart queue management.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 mx-auto hover:bg-gray-100 transition-colors"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Start Free Trial
                        </motion.button>
                        <p className="text-blue-200 mt-4">No credit card required • 14-day free trial</p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;