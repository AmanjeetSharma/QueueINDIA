import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaCrown, FaUser, FaBuilding } from "react-icons/fa";

const Pricing = () => {
    const plans = [
        {
            name: "Basic",
            icon: FaUser,
            price: "Free",
            description: "Perfect for individual users",
            features: [
                "5 appointments per month",
                "Basic queue management",
                "Email notifications",
                "Standard support",
                "Access to public services"
            ],
            limitations: [
                "Advanced analytics",
                "Priority support",
                "Custom reminders",
                "Multi-device sync"
            ],
            buttonText: "Get Started",
            popular: false
        },
        {
            name: "Professional",
            icon: FaCrown,
            price: "₹299",
            period: "/month",
            description: "For power users and small businesses",
            features: [
                "Unlimited appointments",
                "Advanced queue management",
                "SMS & WhatsApp notifications",
                "Priority support",
                "All public & private services",
                "Custom reminders",
                "Multi-device sync",
                "Basic analytics"
            ],
            limitations: [
                "Enterprise integrations",
                "API access",
                "White-label solution"
            ],
            buttonText: "Start Free Trial",
            popular: true
        },
        {
            name: "Enterprise",
            icon: FaBuilding,
            price: "Custom",
            description: "For large organizations & institutions",
            features: [
                "Everything in Professional",
                "Enterprise integrations",
                "API access",
                "White-label solution",
                "Advanced analytics",
                "Dedicated account manager",
                "Custom development",
                "SLA guarantee"
            ],
            limitations: [],
            buttonText: "Contact Sales",
            popular: false
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
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose the perfect plan for your needs. All plans include our core queue management features.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className={`relative bg-white rounded-2xl shadow-lg border-2 ${plan.popular ? 'border-indigo-500 shadow-xl' : 'border-gray-100'
                                } p-6 hover:shadow-xl transition-all`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <plan.icon className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline justify-center mb-2">
                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                    {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
                                </div>
                                <p className="text-gray-600">{plan.description}</p>
                            </div>

                            {/* Features */}
                            <div className="space-y-4 mb-6">
                                <h4 className="font-semibold text-gray-900">What's included:</h4>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center">
                                            <FaCheck className="w-4 h-4 text-green-500 mr-3 shrink-0" />
                                            <span className="text-gray-600 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Limitations */}
                            {plan.limitations.length > 0 && (
                                <div className="space-y-4 mb-6">
                                    <h4 className="font-semibold text-gray-900">Not included:</h4>
                                    <ul className="space-y-3">
                                        {plan.limitations.map((limitation, limitationIndex) => (
                                            <li key={limitationIndex} className="flex items-center">
                                                <FaTimes className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                                                <span className="text-gray-400 text-sm">{limitation}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* CTA Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${plan.popular
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {plan.buttonText}
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="max-w-4xl mx-auto mt-16"
                >
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                question: "Can I change plans later?",
                                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
                            },
                            {
                                question: "Is there a free trial?",
                                answer: "Yes, the Professional plan comes with a 14-day free trial. No credit card required."
                            },
                            {
                                question: "What payment methods do you accept?",
                                answer: "We accept all major credit cards, UPI, net banking, and digital wallets."
                            },
                            {
                                question: "Can I cancel anytime?",
                                answer: "Absolutely. You can cancel your subscription at any time without any cancellation fees."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                                <p className="text-gray-600 text-sm">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Pricing;