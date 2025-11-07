import { motion } from "framer-motion";
import { FaHospital, FaUniversity, FaBuilding, FaShieldAlt, FaMobileAlt, FaClock, FaUsers, FaCheckCircle } from "react-icons/fa";

const Services = () => {
    const services = [
        {
            icon: FaHospital,
            title: "Healthcare Appointments",
            description: "Book appointments with hospitals, clinics, and healthcare providers. Reduce waiting times and get timely medical care.",
            features: ["Doctor Appointments", "Lab Test Bookings", "Specialist Consultations", "Emergency Queue Management"]
        },
        {
            icon: FaUniversity,
            title: "Government Services",
            description: "Access various government departments like RTO, Municipal Corporations, and Public Service Centers without long queues.",
            features: ["RTO Services", "Document Verification", "License Applications", "Public Utility Services"]
        },
        {
            icon: FaBuilding,
            title: "Banking & Financial",
            description: "Schedule visits to banks and financial institutions for account services, loans, and other financial transactions.",
            features: ["Account Services", "Loan Applications", "Document Submission", "Customer Support"]
        },
        {
            icon: FaShieldAlt,
            title: "Corporate Services",
            description: "Manage visitor queues for corporate offices, business centers, and professional service providers.",
            features: ["Visitor Management", "Meeting Scheduling", "Document Processing", "Client Services"]
        }
    ];

    const features = [
        {
            icon: FaMobileAlt,
            title: "Mobile First",
            description: "Access all services from your smartphone with our responsive mobile app"
        },
        {
            icon: FaClock,
            title: "Real-time Updates",
            description: "Get live queue updates and notifications about your appointment status"
        },
        {
            icon: FaUsers,
            title: "Multi-department",
            description: "Access multiple departments and services from a single platform"
        },
        {
            icon: FaCheckCircle,
            title: "Verified Partners",
            description: "All our service partners are verified and quality-checked for your safety"
        }
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Our Services
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        QueueINDIA provides comprehensive virtual queue management solutions across various sectors,
                        making public service access efficient and hassle-free.
                    </p>
                </motion.div>

                {/* Main Services */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <service.icon className="w-6 h-6 text-indigo-600" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {service.description}
                                    </p>
                                    <ul className="space-y-2">
                                        {service.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                                                <FaCheckCircle className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-indigo-600 rounded-2xl p-8 text-white"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-4">Why Choose QueueINDIA?</h2>
                        <p className="text-indigo-100 text-lg">
                            We're revolutionizing how India accesses essential services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-indigo-100 text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are already saving time and avoiding queues with QueueINDIA.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Get Started Free
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Learn More
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Services;