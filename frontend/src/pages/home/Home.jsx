import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useDepartment } from '../../context/DepartmentContext';
import {
    FaCalendarAlt,  
    FaSearch,
    FaClock,
    FaUserCheck,
    FaShieldAlt,
    FaArrowRight,
    FaStar,
    FaUsers,
    FaBuilding,
    FaCheckCircle,
    FaMobileAlt,
    FaChartLine,
    FaHeartbeat
} from 'react-icons/fa';

const Home = () => {
    const { isAuthenticated, user } = useAuth();
    const { departments, getDepartments, loading } = useDepartment();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        totalDepartments: 0,
        totalServices: 0,
        todayAppointments: 0,
        activeUsers: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            await getDepartments();
        };

        fetchData();

        // Simulated stats - replace with actual API call
        setStats({
            totalDepartments: departments.length,
            totalServices: departments.reduce((acc, dept) => acc + (dept.services?.length || 0), 0),
            todayAppointments: 124,
            activeUsers: 543
        });
    }, []);

    const features = [
        {
            icon: FaCalendarAlt,
            title: "Easy Online Booking",
            description: "Book appointments from anywhere, 24/7",
            color: "blue"
        },
        {
            icon: FaClock,
            title: "Real-time Slots",
            description: "See available time slots instantly",
            color: "green"
        },
        {
            icon: FaUserCheck,
            title: "Priority Access",
            description: "Special access for senior citizens & differently abled",
            color: "purple"
        },
        {
            icon: FaShieldAlt,
            title: "Secure & Private",
            description: "Your data is protected with encryption",
            color: "orange"
        }
    ];

    const steps = [
        {
            number: 1,
            title: "Select Department",
            description: "Choose from various government departments",
            icon: FaBuilding
        },
        {
            number: 2,
            title: "Pick Service",
            description: "Select the specific service you need",
            icon: FaSearch
        },
        {
            number: 3,
            title: "Choose Slot",
            description: "Select date and time that works for you",
            icon: FaCalendarAlt
        },
        {
            number: 4,
            title: "Get Confirmed",
            description: "Receive token and appointment details",
            icon: FaCheckCircle
        }
    ];

    const popularDepartments = departments.slice(0, 6);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-800/20"></div>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                <FaStar className="text-yellow-300" />
                                <span className="text-sm font-medium">Trusted by Thousands</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Book Government Services
                                <span className="block text-blue-200">In Just Minutes</span>
                            </h1>

                            <p className="text-lg text-blue-100 mb-8 max-w-lg">
                                Skip the long queues. Book appointments for government services online.
                                Fast, convenient, and hassle-free experience for all citizens.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {isAuthenticated ? (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/departments')}
                                            className="inline-flex items-center justify-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
                                        >
                                            <FaSearch />
                                            Search Departments
                                            <FaArrowRight />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/my-bookings')}
                                            className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
                                        >
                                            <FaClock />
                                            My Bookings
                                        </motion.button>
                                    </>
                                ) : (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/login')}
                                            className="inline-flex items-center justify-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
                                        >
                                            <FaCalendarAlt />
                                            Login to Book
                                            <FaArrowRight />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/departments')}
                                            className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
                                        >
                                            <FaBuilding />
                                            Browse Departments
                                        </motion.button>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 p-6 rounded-xl">
                                        <div className="text-3xl font-bold mb-2">{stats.totalDepartments}+</div>
                                        <div className="text-blue-200">Departments</div>
                                    </div>
                                    <div className="bg-white/10 p-6 rounded-xl">
                                        <div className="text-3xl font-bold mb-2">{stats.totalServices}+</div>
                                        <div className="text-blue-200">Services</div>
                                    </div>
                                    <div className="bg-white/10 p-6 rounded-xl">
                                        <div className="text-3xl font-bold mb-2">{stats.todayAppointments}</div>
                                        <div className="text-blue-200">Today's Appointments</div>
                                    </div>
                                    <div className="bg-white/10 p-6 rounded-xl">
                                        <div className="text-3xl font-bold mb-2">{stats.activeUsers}</div>
                                        <div className="text-blue-200">Active Users</div>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
                                    <div className="flex items-center gap-3">
                                        <FaCheckCircle className="text-green-300 text-xl" />
                                        <div>
                                            <div className="font-bold">No Waiting in Queues</div>
                                            <div className="text-sm text-green-200">Book your slot, arrive on time</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search for departments or services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                            />
                        </div>
                        <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-bold text-lg shadow-lg">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our Platform?</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        We make government service booking simple, transparent, and accessible for everyone
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200"
                        >
                            <div className={`w-14 h-14 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 rounded-xl flex items-center justify-center mb-4`}>
                                <feature.icon className={`text-2xl text-${feature.color}-600`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Get your appointment in just 4 simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                {/* Connecting Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-blue-200 z-0"></div>
                                )}

                                <div className="relative bg-white rounded-2xl p-6 shadow-lg text-center z-10">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <div className="text-white text-xl font-bold">{step.number}</div>
                                    </div>
                                    <step.icon className="text-3xl text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                    <p className="text-slate-600">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popular Departments */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Popular Departments</h2>
                        <p className="text-slate-600 mt-2">Most frequently booked government departments</p>
                    </div>
                    <Link
                        to="/departments"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold"
                    >
                        View All
                        <FaArrowRight />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow animate-pulse">
                                <div className="h-8 bg-slate-200 rounded mb-4"></div>
                                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularDepartments.map((dept, index) => (
                            <motion.div
                                key={dept._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                onClick={() => navigate(`/departments/${dept._id}`)}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-slate-200"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                        <FaBuilding className="text-blue-600 text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 text-lg">{dept.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <FaMapMarkerAlt className="text-xs" />
                                            {dept.address?.city}, {dept.address?.state}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-slate-600">Available Services</span>
                                    <span className="font-bold text-blue-600">{dept.services?.length || 0}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${dept.isSlotBookingEnabled
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {dept.isSlotBookingEnabled ? 'Online Booking' : 'Walk-in Only'}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {dept.departmentCategory}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Testimonials */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">What Citizens Say</h2>
                        <p className="text-blue-200 max-w-2xl mx-auto">
                            Hear from people who have used our platform to book government services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Rajesh Kumar",
                                role: "Senior Citizen",
                                feedback: "The priority booking for senior citizens saved me hours of waiting time. Very convenient!",
                                rating: 5
                            },
                            {
                                name: "Priya Sharma",
                                role: "Working Professional",
                                feedback: "I could book my passport appointment during office hours. The online system is a lifesaver.",
                                rating: 5
                            },
                            {
                                name: "Amit Patel",
                                role: "Business Owner",
                                feedback: "Getting trade license renewal appointment was so easy. The slot availability was transparent.",
                                rating: 4
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <FaStar key={i} className="text-yellow-300" />
                                    ))}
                                </div>
                                <p className="text-blue-100 mb-6 italic">"{testimonial.feedback}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                                    <div>
                                        <div className="font-bold">{testimonial.name}</div>
                                        <div className="text-sm text-blue-200">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Book Your Appointment?</h2>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of satisfied citizens who have simplified their government service bookings
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isAuthenticated ? (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/departments')}
                                    className="inline-flex items-center justify-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
                                >
                                    <FaCalendarAlt />
                                    Book Now
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/my-bookings')}
                                    className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
                                >
                                    <FaClock />
                                    View My Bookings
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/register')}
                                    className="inline-flex items-center justify-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
                                >
                                    <FaUsers />
                                    Create Free Account
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/departments')}
                                    className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
                                >
                                    <FaBuilding />
                                    Browse Departments
                                </motion.button>
                            </>
                        )}
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-blue-200">
                        <div className="flex items-center gap-2">
                            <FaCheckCircle />
                            <span>No Hidden Fees</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaShieldAlt />
                            <span>Secure & Private</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaMobileAlt />
                            <span>Mobile Friendly</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaHeartbeat />
                            <span>24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="bg-slate-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-2xl font-bold mb-1">{stats.totalDepartments}+</div>
                            <div className="text-slate-400 text-sm">Government Departments</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold mb-1">{stats.totalServices}+</div>
                            <div className="text-slate-400 text-sm">Services Available</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold mb-1">10K+</div>
                            <div className="text-slate-400 text-sm">Appointments Booked</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold mb-1">99%</div>
                            <div className="text-slate-400 text-sm">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// You'll need to add FaMapMarkerAlt to your imports
import { FaMapMarkerAlt } from 'react-icons/fa';

export default Home;