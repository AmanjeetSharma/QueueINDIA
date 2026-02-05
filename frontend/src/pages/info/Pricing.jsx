import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaCheck,
  FaTimes,
  FaBuilding,
  FaUsers,
  FaChartLine,
  FaServer,
  FaShieldAlt,
  FaPhoneAlt,
  FaCreditCard,
  FaRupeeSign,
  FaDollarSign,
  FaArrowRight,
  FaQuestionCircle,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle
} from "react-icons/fa";
import { MdSpeed, MdSupport, MdArrowForward } from "react-icons/md";
import { HiOutlineLightningBolt } from "react-icons/hi";

const Pricing = () => {
  const [currency, setCurrency] = useState('INR');
  const [billingCycle, setBillingCycle] = useState('annual');
  const [activeFaq, setActiveFaq] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pricingTiers = [
    {
      id: 'basic',
      name: 'Starter',
      description: 'For small departments with limited services',
      price: {
        INR: { monthly: 4999, annual: 47990 },
        USD: { monthly: 60, annual: 575 }
      },
      features: {
        included: [
          { text: 'Up to 5 services', icon: FaBuilding },
          { text: '500 monthly bookings', icon: FaUsers },
          { text: 'Basic dashboard', icon: FaChartLine },
          { text: 'Standard support', icon: MdSupport },
          { text: 'Email notifications', icon: FaCheck }
        ],
        excluded: [
          'Custom integrations',
          'Advanced analytics',
          'Priority support',
          'Custom branding',
          'API access'
        ]
      },
      cta: 'Get Started',
      popular: false,
      color: 'from-blue-500 to-cyan-500',
      mobileColor: 'bg-blue-50 border-blue-100'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For medium departments with growing needs',
      price: {
        INR: { monthly: 14999, annual: 143990 },
        USD: { monthly: 180, annual: 1725 }
      },
      features: {
        included: [
          { text: 'Up to 25 services', icon: FaBuilding },
          { text: '5000 monthly bookings', icon: FaUsers },
          { text: 'Advanced analytics', icon: FaChartLine },
          { text: 'Priority support', icon: MdSupport },
          { text: 'Custom integrations', icon: FaCheck },
          { text: 'API access', icon: FaServer },
          { text: 'SMS notifications', icon: FaPhoneAlt }
        ],
        excluded: [
          'White-label solution',
          'Dedicated account manager',
          'Custom development',
          'On-premise deployment'
        ]
      },
      cta: 'Start Free Trial',
      popular: true,
      color: 'from-purple-500 to-pink-500',
      mobileColor: 'bg-purple-50 border-purple-100'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large government departments',
      price: {
        INR: { monthly: 49999, annual: 479990 },
        USD: { monthly: 600, annual: 5750 }
      },
      features: {
        included: [
          { text: 'Unlimited services', icon: FaBuilding },
          { text: 'Unlimited bookings', icon: FaUsers },
          { text: 'Advanced analytics + AI', icon: FaChartLine },
          { text: '24/7 priority support', icon: MdSupport },
          { text: 'Custom integrations', icon: FaCheck },
          { text: 'Full API access', icon: FaServer },
          { text: 'White-label solution', icon: FaShieldAlt },
          { text: 'Dedicated account manager', icon: FaUsers },
          { text: 'Custom development', icon: FaCheck },
          { text: 'On-premise deployment', icon: FaServer }
        ],
        excluded: []
      },
      cta: 'Contact Sales',
      popular: false,
      color: 'from-orange-500 to-red-500',
      mobileColor: 'bg-orange-50 border-orange-100'
    }
  ];

  const scalabilityFeatures = [
    {
      title: 'Small Departments',
      description: 'Local municipal offices, small govt offices',
      capacity: 'Up to 5,000 citizens/month',
      priceRange: '₹4,999 - ₹14,999/month',
      icon: FaBuilding,
      color: 'bg-blue-100 text-blue-600',
      mobileIconColor: 'text-blue-500'
    },
    {
      title: 'Medium Departments',
      description: 'District level offices, medium govt departments',
      capacity: 'Up to 50,000 citizens/month',
      priceRange: '₹14,999 - ₹49,999/month',
      icon: FaChartLine,
      color: 'bg-purple-100 text-purple-600',
      mobileIconColor: 'text-purple-500'
    },
    {
      title: 'Large Departments',
      description: 'State level departments, major govt ministries',
      capacity: '50,000+ citizens/month',
      priceRange: 'Custom pricing',
      icon: HiOutlineLightningBolt,
      color: 'bg-orange-100 text-orange-600',
      mobileIconColor: 'text-orange-500'
    }
  ];

  const additionalServices = [
    {
      name: 'Custom Integration',
      description: 'Integration with existing government systems',
      price: { INR: 29999, USD: 360 },
      type: 'one-time',
      icon: FaServer,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      name: 'Advanced Analytics',
      description: 'AI-powered insights and reporting',
      price: { INR: 9999, USD: 120 },
      type: 'monthly',
      icon: FaChartLine,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      name: 'White Label',
      description: 'Custom branding and domain',
      price: { INR: 19999, USD: 240 },
      type: 'monthly',
      icon: FaShieldAlt,
      color: 'bg-green-50 text-green-600'
    },
    {
      name: 'Training',
      description: 'Staff training and onboarding',
      price: { INR: 14999, USD: 180 },
      type: 'one-time',
      icon: FaUsers,
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  const faqs = [
    {
      q: "Can I change plans later?",
      a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
    },
    {
      q: "Is there a setup fee?",
      a: "No setup fees for any plan. Implementation costs may apply for custom integrations."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, net banking, UPI, and bank transfers."
    },
    {
      q: "Do you offer government discounts?",
      a: "Yes, special discounted rates are available for government departments."
    },
    {
      q: "Is there a free trial?",
      a: "Yes, the Professional plan includes a 14-day free trial."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes, you can cancel your subscription at any time with no penalties."
    }
  ];

  const calculatePrice = (price) => {
    return billingCycle === 'annual' ? price.annual : price.monthly;
  };

  const formatPrice = (amount) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }
  };

  const calculateSavings = (monthlyPrice, annualPrice) => {
    const monthlyTotal = monthlyPrice * 12;
    const savings = monthlyTotal - annualPrice;
    const percentage = ((savings / monthlyTotal) * 100).toFixed(0);
    return { savings: formatPrice(savings), percentage };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Mobile-Optimized Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Department Partnership Pricing
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Transparent, scalable pricing for government departments of all sizes.
            </p>

            {/* Mobile-Optimized Currency & Billing Toggles */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                {/* Currency Toggle - Stacked on Mobile */}
                <div className="w-full sm:w-auto">
                  <div className="text-xs text-blue-200 mb-1 sm:mb-2 font-medium">Currency</div>
                  <div className="flex bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-0.5">
                    <button
                      onClick={() => setCurrency('INR')}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 sm:px-4 py-2 rounded-md font-medium transition-all text-sm ${currency === 'INR'
                        ? 'bg-white text-blue-600'
                        : 'text-white hover:bg-white/10'
                        }`}
                    >
                      <FaRupeeSign className="w-3 h-3 sm:w-4 sm:h-4" />
                      INR
                    </button>
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 sm:px-4 py-2 rounded-md font-medium transition-all text-sm ${currency === 'USD'
                        ? 'bg-white text-blue-600'
                        : 'text-white hover:bg-white/10'
                        }`}
                    >
                      <FaDollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                      USD
                    </button>
                  </div>
                </div>

                {/* Billing Toggle - Stacked on Mobile */}
                <div className="w-full sm:w-auto">
                  <div className="text-xs text-blue-200 mb-1 sm:mb-2 font-medium">Billing</div>
                  <div className="flex bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-0.5">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`flex-1 px-3 sm:px-4 py-2 rounded-md font-medium transition-all text-sm ${billingCycle === 'monthly'
                        ? 'bg-white text-blue-600'
                        : 'text-white hover:bg-white/10'
                        }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle('annual')}
                      className={`flex-1 px-3 sm:px-4 py-2 rounded-md font-medium transition-all text-sm ${billingCycle === 'annual'
                        ? 'bg-white text-blue-600'
                        : 'text-white hover:bg-white/10'
                        }`}
                    >
                      Annual
                    </button>
                  </div>
                </div>
              </div>

              {billingCycle === 'annual' && (
                <div className="mt-3 text-xs sm:text-sm text-green-300 font-medium">
                  🎉 Save up to 20% with annual billing
                </div>
              )}
            </div>

            <div className="text-xs sm:text-sm text-blue-200 flex items-center justify-center gap-1">
              <FaStar className="w-3 h-3" />
              All prices exclude GST/TAX
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile: Horizontal Scroll Pricing Cards */}
        {/* Desktop: Grid Layout */}
        <div className="mb-8 sm:mb-12">
          <div className="flex sm:hidden overflow-x-auto pb-4 -mx-3 px-3 snap-x snap-mandatory">
            <div className="flex gap-4">
              {pricingTiers.map((tier, index) => {
                const price = calculatePrice(tier.price[currency]);
                const savings = calculateSavings(tier.price[currency].monthly, tier.price[currency].annual);

                return (
                  <div key={tier.id} className="w-[85vw] flex-shrink-0 snap-center">
                    <div className={`rounded-xl border ${tier.popular
                      ? 'border-purple-300 shadow-lg'
                      : 'border-gray-200 shadow'
                      } ${tier.mobileColor} overflow-hidden h-full`}>
                      {tier.popular && (
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 text-xs font-bold text-center">
                          MOST POPULAR
                        </div>
                      )}

                      <div className="p-4 sm:p-6">
                        <div className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${tier.color} text-white text-xs font-semibold mb-3`}>
                          {tier.name}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">{tier.name} Plan</h3>
                        <p className="text-gray-600 text-xs mb-4">{tier.description}</p>

                        <div className="mb-4">
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-gray-900">
                              {formatPrice(price)}
                            </span>
                            <span className="text-gray-500 ml-1 text-sm">
                              /{billingCycle === 'annual' ? 'year' : 'month'}
                            </span>
                          </div>

                          {billingCycle === 'annual' && (
                            <div className="mt-1 text-xs text-green-600 font-medium">
                              Save {savings.percentage}%
                            </div>
                          )}
                        </div>

                        <button className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${tier.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                          }`}>
                          {tier.cta}
                        </button>

                        <div className="mt-6 space-y-3">
                          <div className="text-xs font-semibold text-gray-700">Key Features:</div>
                          {tier.features.included.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <feature.icon className="w-2.5 h-2.5 text-green-600" />
                              </div>
                              <span className="text-xs text-gray-600">{feature.text}</span>
                            </div>
                          ))}
                          {tier.features.included.length > 3 && (
                            <div className="text-xs text-blue-600 font-medium">
                              + {tier.features.included.length - 3} more features
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {pricingTiers.map((tier, index) => {
              const price = calculatePrice(tier.price[currency]);
              const savings = calculateSavings(tier.price[currency].monthly, tier.price[currency].annual);

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-xl sm:rounded-2xl border ${tier.popular
                    ? 'border-purple-300 shadow-xl'
                    : 'border-gray-200 shadow-lg'
                    } bg-white overflow-hidden`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                        POPULAR
                      </div>
                    </div>
                  )}

                  <div className="p-5 sm:p-6 md:p-8">
                    <div className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${tier.color} text-white text-xs font-semibold mb-3 sm:mb-4`}>
                      {tier.name}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{tier.name}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">{tier.description}</p>

                    <div className="mb-4 sm:mb-6">
                      <div className="flex items-baseline">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {formatPrice(price)}
                        </span>
                        <span className="text-gray-500 ml-2 text-sm">
                          /{billingCycle === 'annual' ? 'year' : 'month'}
                        </span>
                      </div>

                      {billingCycle === 'annual' && (
                        <div className="mt-1 text-xs sm:text-sm text-green-600 font-medium">
                          Save {savings.percentage}% ({savings.savings})
                        </div>
                      )}
                    </div>

                    <button className={`w-full py-3 px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all ${tier.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                      }`}>
                      {tier.cta}
                    </button>

                    <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                      <div className="text-xs sm:text-sm font-semibold text-gray-700">What's included:</div>
                      {tier.features.included.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 sm:gap-3">
                          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <feature.icon className="w-2.5 h-2.5 text-green-600" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Scalability Section - Mobile Vertical Layout */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              Choose Based on Your Size
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto px-4">
              Pricing scales with your department's monthly citizen traffic
            </p>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
            {scalabilityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${feature.color} flex-shrink-0`}>
                    <feature.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${feature.mobileIconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-xs mb-3">{feature.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Capacity:</span>
                        <span className="font-semibold">{feature.capacity}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-semibold text-blue-600">{feature.priceRange}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Services - Mobile Carousel */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Add-On Services
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto px-4">
              Enhance your experience with premium add-ons
            </p>
          </div>

          <div className="flex sm:hidden overflow-x-auto pb-4 -mx-3 px-3">
            <div className="flex gap-3">
              {additionalServices.map((service, index) => (
                <div key={index} className="w-64 flex-shrink-0">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${service.color}`}>
                        <service.icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900">{service.name}</h3>
                    </div>
                    <p className="text-gray-600 text-xs mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-bold text-gray-900">
                          {currency === 'INR' ? '₹' : '$'}{service.price[currency].toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {service.type === 'one-time' ? 'One-time' : 'Per month'}
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-medium text-xs hover:bg-blue-100">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${service.color}`}>
                    <service.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">{service.name}</h3>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-gray-900">
                      {currency === 'INR' ? '₹' : '$'}{service.price[currency].toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {service.type === 'one-time' ? 'One-time fee' : 'Per month'}
                    </div>
                  </div>
                  <button className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100">
                    Add Service
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section - Mobile Accordion */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Common Questions
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto px-4">
              Get answers to frequently asked questions
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {isMobile ? (
                  // Mobile: Accordion
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <FaQuestionCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                      </div>
                      {activeFaq === index ? (
                        <FaChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <FaChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    <AnimatePresence>
                      {activeFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-3">
                            <div className="pl-7">
                              <p className="text-sm text-gray-600">{faq.a}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Desktop: Grid
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <FaQuestionCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{faq.q}</h4>
                        <p className="text-gray-600 text-sm">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section - Mobile Stacked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white text-center"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
            Join hundreds of government departments using QueueIndia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-blue-600 font-bold rounded-lg hover:shadow-xl transition-shadow text-sm sm:text-base"
            >
              Get Custom Quote
              <MdArrowForward className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-transparent border border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              <FaPhoneAlt className="w-3 h-3 sm:w-4 sm:h-4" />
              Schedule Demo
            </Link>
          </div>
          <div className="mt-4 sm:mt-6">
            <div className="text-xs sm:text-sm text-blue-200 mb-2">
              Need help choosing? We're here to help!
            </div>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
              <FaPhoneAlt className="w-3 h-3" />
              Call us: 1800-123-4567
            </div>
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-6"
        >
          <p className="text-gray-500 text-sm">
            By creating an account, you agree to our{" "}
            <Link to="/terms-of-service" className="text-blue-600 hover:text-blue-500">Terms</Link> and{" "}
            <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2024 QueueINDIA. Secure public service portal.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;