import { useState, useEffect } from "react";
import Card from "../components/Card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animated Card Component
const AnimatedCard = ({ title, desc, delay = 0 }) => {
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
            whileHover={{ y: -5, scale: 1.02 }}
            className="h-full"
        >
            <Card title={title} desc={desc} />
        </motion.div>
    );
};

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50">
            <main className="max-w-7xl mx-auto px-6 py-16">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h1
                            className="text-5xl sm:text-6xl font-bold leading-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            Streamlining customer queues with{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10">QueueINDIA</span>
                                <motion.span
                                    className="absolute bottom-2 left-0 w-full h-3 bg-indigo-200 opacity-40"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                />
                            </span>
                        </motion.h1>

                        <motion.p
                            className="mt-6 text-xl text-gray-600 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            A simple, fast and reliable way to manage queues and appointments.
                            Reduce waiting times, improve service and get actionable insights.
                        </motion.p>

                        <motion.div
                            className="mt-10 flex flex-wrap gap-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            {/* Try Demo Button */}
                            <motion.a
                                href="#"
                                className="px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold relative overflow-hidden group"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full h-full"
                                >
                                    <span className="relative z-10">Try Demo</span>
                                    <div className="absolute inset-0 bg-linear-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.button>
                            </motion.a>

                            {/* Learn More Button */}
                            <motion.a
                                href="/about"
                                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-all duration-300 font-semibold"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full h-full"
                                >
                                    Learn More
                                </motion.button>
                            </motion.a>
                        </motion.div>


                        <motion.div
                            className="mt-12 flex items-center space-x-8 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                        >
                            <div className="flex items-center space-x-3">
                                <motion.div
                                    className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-sm"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </motion.div>
                                <span className="text-gray-600 font-medium">No credit card required</span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <motion.div
                                    className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center shadow-sm"
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </motion.div>
                                <span className="text-gray-600 font-medium">Trusted by businesses</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Animated Hero Graphic */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-purple-50 border border-gray-200 shadow-2xl">
                            {/* Animated background elements */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-full"
                                animate={{
                                    background: [
                                        "radial-gradient(circle at 20% 80%, rgba(199, 210, 254, 0.3) 0%, transparent 50%)",
                                        "radial-gradient(circle at 80% 20%, rgba(199, 210, 254, 0.3) 0%, transparent 50%)",
                                        "radial-gradient(circle at 20% 80%, rgba(199, 210, 254, 0.3) 0%, transparent 50%)",
                                    ],
                                }}
                                transition={{ duration: 8, repeat: Infinity }}
                            />

                            {/* Main dashboard illustration */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    className="w-4/5 h-4/5 bg-white rounded-xl shadow-2xl border border-gray-100 p-6"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                >
                                    {/* Dashboard content */}
                                    <div className="flex flex-col h-full">
                                        <div className="flex space-x-2 mb-4">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 flex-1">
                                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                                <motion.div
                                                    key={item}
                                                    className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
                                                    whileHover={{ scale: 1.05 }}
                                                    animate={{
                                                        y: [0, -5, 0],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        delay: item * 0.2,
                                                        repeat: Infinity,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <motion.div
                            className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-200 rounded-full opacity-20"
                            animate={{
                                y: [0, -20, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-200 rounded-full opacity-20"
                            animate={{
                                y: [0, 20, 0],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                delay: 1,
                            }}
                        />
                    </motion.div>
                </div>

                {/* Features Section */}
                <motion.section
                    className="mt-32"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900">Core Features</h2>
                        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Everything you need to manage in-person and virtual queues effortlessly.
                            Powered by cutting-edge technology for seamless customer experiences.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Digital Tickets", desc: "Issue and track tickets instantly with mobile and kiosk integrations." },
                            { title: "Real-time Dashboard", desc: "Monitor wait times, staff load and customer flow in real time." },
                            { title: "Advanced Analytics", desc: "Get insights to optimize staffing and reduce wait times." },
                            { title: "Smart Notifications", desc: "Notify customers via SMS or push when their turn is near." },
                            { title: "Multi-location Support", desc: "Manage queues across multiple branches from one panel." },
                            { title: "Fully Customizable", desc: "Tailor queue flows, priorities and service types to your business." },
                        ].map((feature, index) => (
                            <AnimatedCard
                                key={feature.title}
                                title={feature.title}
                                desc={feature.desc}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                </motion.section>

                {/* CTA Section */}
                <motion.section
                    className="mt-32 text-center"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
                        <motion.h3
                            className="text-3xl font-bold mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            Ready to Transform Your Queue Management?
                        </motion.h3>
                        <motion.p
                            className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            Join thousands of businesses already using QueueINDIA to enhance customer satisfaction and operational efficiency.
                        </motion.p>
                        <motion.button
                            className="px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            Get Started Today
                        </motion.button>
                    </div>
                </motion.section>
            </main>

            {/* Footer */}
            <motion.footer
                className="bg-white border-t mt-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
                    <div className="mb-4 md:mb-0 font-medium">
                        © {new Date().getFullYear()} QueueINDIA. All rights reserved.
                    </div>
                    <div className="flex space-x-6">
                        {["Privacy", "Terms", "Contact", "Support"].map((item) => (
                            <motion.a
                                key={item}
                                href="#"
                                className="hover:text-indigo-600 font-medium transition-colors duration-300"
                                whileHover={{ y: -2 }}
                            >
                                {item}
                            </motion.a>
                        ))}
                    </div>
                </div>
            </motion.footer>
        </div>
    );
};

export default Home;