import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useDepartment } from '../../context/DepartmentContext';
import {
    Calendar,
    Clock,
    Shield,
    Users,
    Building2,
    Phone,
    MapPin,
    Star,
    ChevronRight,
    CheckCircle2,
    Home as HomeIcon,
    Award,
    Sparkles
} from 'lucide-react';
import Footer from './Footer';

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const CountUp = ({ target, suffix = '' }) => {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = target / 50;
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setVal(target); clearInterval(timer); }
            else setVal(Math.floor(start));
        }, 20);
        return () => clearInterval(timer);
    }, [inView, target]);
    return <span ref={ref}>{val}{suffix}</span>;
};

const Home = () => {
    const { isAuthenticated } = useAuth();
    const { departments, getDepartments, loading } = useDepartment();
    const navigate = useNavigate();

    useEffect(() => {
        if (departments.length === 0) {
            getDepartments();
        }
    }, []);

    const features = [
        { icon: Calendar, title: 'Book anytime, anywhere', body: 'Online appointments 24/7. No phone calls, no lines.', color: '#2563eb', bg: '#eff6ff' },
        { icon: Clock, title: 'Live slot availability', body: 'See open slots in real time. Pick what suits you best.', color: '#059669', bg: '#ecfdf5' },
        { icon: Shield, title: 'Private & secure', body: 'Your data stays yours. End-to-end encrypted and safe.', color: '#7c3aed', bg: '#f5f3ff' },
        { icon: Users, title: 'Priority access', body: 'Senior citizens and differently-abled get fast-tracked slots.', color: '#d97706', bg: '#fffbeb' },
    ];

    const steps = [
        { n: '01', title: 'Pick a department', body: 'Browse or search from all available departments in your area.' },
        { n: '02', title: 'Choose a service', body: 'Select exactly what you need — no guesswork, just clear options.' },
        { n: '03', title: 'Select a slot', body: 'Pick a date and time that actually fits your schedule.' },
        { n: '04', title: 'Show up on time', body: 'Get your token and confirmation instantly. Just walk in.' },
    ];

    const popularDepts = departments.slice(0, 6);

    const getStatusConfig = (status) => ({
        active: { bg: 'bg-green-50', color: 'text-green-700', dot: 'bg-green-500', label: 'Active' },
        inactive: { bg: 'bg-red-50', color: 'text-red-700', dot: 'bg-red-500', label: 'Inactive' },
        'under-maintenance': { bg: 'bg-amber-50', color: 'text-amber-700', dot: 'bg-amber-500', label: 'Maintenance' },
    }[status] || { bg: 'bg-gray-100', color: 'text-gray-600', dot: 'bg-gray-400', label: status || 'Unknown' });

    const totalServices = departments.reduce((acc, d) => acc + (d.stats?.totalServices || d.services?.length || 0), 0);

    const DepartmentSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100 animate-pulse">
                    <div className="flex gap-3 md:gap-4 mb-3 md:mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gray-100" />
                        <div className="flex-1">
                            <div className="h-3 md:h-4 bg-gray-100 rounded-lg w-3/4 mb-2" />
                            <div className="h-2 md:h-3 bg-gray-100 rounded-lg w-1/2" />
                        </div>
                    </div>
                    <div className="h-2 md:h-3 bg-gray-100 rounded-lg w-2/3 mb-2" />
                    <div className="h-2 md:h-3 bg-gray-100 rounded-lg w-1/2 mb-3 md:mb-4" />
                    <div className="flex gap-3 mb-3 md:mb-4">
                        <div className="h-2 md:h-3 bg-gray-100 rounded-lg w-1/3" />
                        <div className="h-2 md:h-3 bg-gray-100 rounded-lg w-1/3" />
                    </div>
                    <div className="h-9 md:h-10 bg-gray-100 rounded-lg md:rounded-xl" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section - Mobile Optimized */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-800 to-blue-700 py-12 md:py-16 lg:py-20 xl:py-28">
                <div className="absolute top-20 right-0 w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-emerald-500/10 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <motion.div initial="hidden" animate="show" variants={stagger}>
                            <motion.div variants={fadeUp}>
                                <span className="inline-flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-blue-100 mb-4 md:mb-6">
                                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse" />
                                    Serving citizens 24/7
                                </span>
                            </motion.div>

                            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent leading-tight mb-4 md:mb-6">
                                Skip the queue.<br />
                                <span className="bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Book your slot</span><br />
                                in minutes.
                            </motion.h1>

                            <motion.p variants={fadeUp} className="text-base md:text-lg text-slate-300 max-w-md mb-6 md:mb-8">
                                Appointments for government and civic services — online, instant, and hassle-free for every citizen.
                            </motion.p>

                            <motion.div variants={fadeUp} className="flex gap-3 md:gap-4 flex-wrap">
                                <button
                                    onClick={() => navigate(isAuthenticated ? '/departments' : '/login')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all hover:translate-y-[-2px] shadow-lg shadow-blue-600/30 flex items-center gap-1.5 md:gap-2 text-sm md:text-base"
                                >
                                    {isAuthenticated ? 'Book an appointment' : 'Login to book'}
                                    <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </button>
                                <button
                                    onClick={() => navigate('/departments')}
                                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-medium transition-all hover:bg-white/20 hover:translate-y-[-2px] text-sm md:text-base"
                                >
                                    Browse departments
                                </button>
                            </motion.div>
                        </motion.div>

                        {/* Stats Card - Mobile Optimized */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8"
                        >
                            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                                {[
                                    { label: 'Departments', value: departments.length || 12, suffix: '' },
                                    { label: 'Services available', value: totalServices || 48, suffix: '' },
                                    { label: "Today's bookings", value: 123, suffix: '' },
                                    { label: 'Happy citizens', value: 404, suffix: '+' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 text-center">
                                        <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                                            <CountUp target={s.value} suffix={s.suffix} />
                                        </div>
                                        <div className="text-[10px] md:text-xs text-slate-300 mt-0.5 md:mt-1">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg md:rounded-xl p-3 md:p-4 flex items-center gap-2 md:gap-3">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-xs md:text-sm font-semibold text-emerald-100">No more waiting in lines</div>
                                    <div className="text-[10px] md:text-xs text-emerald-300">Book your slot · arrive on time</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section - Mobile Optimized */}
            <section className="py-12 md:py-16 lg:py-20 px-4 max-w-7xl mx-auto">
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
                    <motion.div variants={fadeUp} className="text-center mb-8 md:mb-12">
                        <p className="text-xs md:text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Why choose us</p>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">Designed for every citizen</h2>
                        <p className="text-sm md:text-base text-slate-600 mt-2 md:mt-4 max-w-md mx-auto px-4">Simple, accessible, and built with your convenience in mind.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div
                                    key={i}
                                    variants={fadeUp}
                                    whileHover={{ y: -6 }}
                                    className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                                >
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4" style={{ background: f.bg, color: f.color }}>
                                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 mb-1 md:mb-2 text-base md:text-lg">{f.title}</h3>
                                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{f.body}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </section>

            {/* How It Works Section - Mobile Optimized */}
            <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-16 lg:py-20 px-4 border-y border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
                        <motion.div variants={fadeUp} className="text-center mb-8 md:mb-12">
                            <p className="text-xs md:text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Simple process</p>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">Four steps to a confirmed appointment</h2>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {steps.map((s, i) => (
                                <motion.div key={i} variants={fadeUp} className="text-center">
                                    <div className={`
                                        w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold mx-auto mb-3 md:mb-5
                                        ${i === 0 ? 'bg-slate-900 text-white shadow-lg' : 'bg-gray-100 text-slate-500'}
                                    `}>
                                        {s.n}
                                    </div>
                                    <h3 className="font-semibold text-slate-900 mb-1 md:mb-2 text-sm md:text-base">{s.title}</h3>
                                    <p className="text-xs md:text-sm text-slate-600 px-2">{s.body}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Popular Departments Section - Mobile Optimized */}
            <section className="py-12 md:py-16 lg:py-20 px-4 max-w-7xl mx-auto">
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
                    <motion.div variants={fadeUp} className="flex justify-between items-end flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
                        <div>
                            <p className="text-xs md:text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Browse by department</p>
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">Most visited this month</h2>
                        </div>
                        <button
                            onClick={() => navigate('/departments')}
                            className="text-blue-600 font-semibold hover:bg-blue-50 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all flex items-center gap-1 text-sm md:text-base"
                        >
                            View all
                            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                    </motion.div>

                    {loading ? (
                        <DepartmentSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {popularDepts.map((dept, i) => {
                                const location = dept.location || {};
                                const stats = dept.stats || {};
                                const contact = dept.contact || {};
                                const sc = getStatusConfig(dept.status);
                                const serviceCount = stats.totalServices || dept.services?.length || 0;
                                const cityLine = [location.city, location.pincode].filter(Boolean).join(', ');

                                return (
                                    <motion.div
                                        key={dept._id}
                                        variants={fadeUp}
                                        whileHover={{ y: -4 }}
                                        className="bg-white rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all"
                                    >
                                        <div className="p-4 md:p-6">
                                            <div className="flex gap-3 md:gap-4 mb-3 md:mb-4">
                                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0">
                                                    <Building2 className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-slate-900 text-base md:text-lg truncate">{dept.name}</h3>
                                                    <div className="flex items-center gap-1.5 md:gap-2 mt-1 flex-wrap">
                                                        <span className={`inline-flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs font-medium px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full ${sc.bg} ${sc.color}`}>
                                                            <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${sc.dot}`} />
                                                            {sc.label}
                                                        </span>
                                                        {dept.category && (
                                                            <span className="text-[10px] md:text-xs text-slate-400">{dept.category}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                                                {cityLine && (
                                                    <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-slate-600">
                                                        <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-400" />
                                                        <span className="truncate">{cityLine}</span>
                                                    </div>
                                                )}
                                                {contact.phone && (
                                                    <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-slate-600">
                                                        <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-400" />
                                                        <span>{contact.phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 md:gap-4 py-2 md:py-3 border-t border-b border-gray-50 mb-3 md:mb-4">
                                                <div className="flex items-center gap-1 md:gap-1.5 text-xs md:text-sm text-slate-600">
                                                    <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-400" />
                                                    <span>{serviceCount} service{serviceCount !== 1 ? 's' : ''}</span>
                                                </div>
                                                {stats.averageRating > 0 && (
                                                    <div className="flex items-center gap-1 md:gap-1.5 text-xs md:text-sm text-slate-600">
                                                        <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-amber-400 text-amber-400" />
                                                        <span>{stats.averageRating}/5</span>
                                                        {stats.totalReviews > 0 && (
                                                            <span className="text-slate-400 text-[10px] md:text-xs">({stats.totalReviews})</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {dept.servicesPreview && dept.servicesPreview.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-5">
                                                    {dept.servicesPreview.slice(0, 3).map((sv, idx) => (
                                                        <span key={idx} className="text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-gray-50 border border-gray-100 text-slate-600">
                                                            {sv}
                                                        </span>
                                                    ))}
                                                    {dept.servicesPreview.length > 3 && (
                                                        <span className="text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-gray-50 border border-gray-100 text-slate-400">
                                                            +{dept.servicesPreview.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="px-4 md:px-6 pb-4 md:pb-6">
                                            <Link
                                                to={`/departments/${dept._id}`}
                                                className="flex items-center justify-center gap-1.5 md:gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg md:rounded-xl py-2.5 md:py-3 text-xs md:text-sm font-semibold transition-all"
                                            >
                                                View details
                                                <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {!loading && popularDepts.length === 0 && (
                        <motion.div variants={fadeUp} className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl border border-gray-100">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <Building2 className="w-6 h-6 md:w-8 md:h-8 text-slate-400" />
                            </div>
                            <p className="font-semibold text-slate-700 mb-1 text-sm md:text-base">No departments available</p>
                            <p className="text-xs md:text-sm text-slate-500 mb-3 md:mb-4">Please check back later or refresh the page.</p>
                            <button
                                onClick={() => getDepartments()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all"
                            >
                                Retry
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </section>

            {/* Testimonials Section - Mobile Optimized */}
            <section className="bg-slate-900 py-12 md:py-16 lg:py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
                        <motion.div variants={fadeUp} className="text-center mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Real experiences, real stories</h2>
                            <p className="text-sm md:text-base text-slate-400 mt-2 md:mt-4">Hear what citizens have to say about their experience.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {[
                                { name: 'Rajesh Kumar', role: 'Senior citizen', text: 'The priority access for seniors meant I didn\'t have to stand in the sun for two hours. Booked from home, walked in, done.', location: 'Mumbai' },
                                { name: 'Priya Sharma', role: 'Working professional', text: 'I booked my passport slot in under three minutes during a chai break. Would\'ve taken me half a day the old way.', location: 'Delhi' },
                                { name: 'Amit Patel', role: 'Business owner', text: 'Trade license renewal used to be a nightmare. Now I pick a slot, show up, and it\'s sorted. Night and day difference.', location: 'Ahmedabad' },
                            ].map((t, i) => (
                                <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}
                                    className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 transition-all"
                                >
                                    <div className="flex gap-0.5 mb-3 md:mb-4">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-3 md:mb-5">"{t.text}"</p>
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm md:text-base">
                                            {t.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white text-xs md:text-sm">{t.name}</div>
                                            <div className="text-[10px] md:text-xs text-slate-500">{t.role} · {t.location}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA Section - Mobile Optimized */}
            <section className="py-12 md:py-16 lg:py-20 px-4 max-w-7xl mx-auto">
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-blue-500/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-emerald-500/20 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
                                Ready to skip the queue?
                            </h2>
                            <p className="text-sm md:text-base text-slate-300 mb-6 md:mb-8 max-w-md mx-auto px-4">
                                Join thousands of citizens who've made service visits stress-free and efficient.
                            </p>

                            <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => navigate('/departments')}
                                        className="bg-white text-slate-900 px-5 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold hover:shadow-xl transition-all hover:-translate-y-0.5 text-sm md:text-base"
                                    >
                                        Book your appointment
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => navigate('/register')}
                                            className="bg-white text-slate-900 px-5 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold hover:shadow-xl transition-all hover:-translate-y-0.5 text-sm md:text-base cursor-pointer"
                                        >
                                            Create your account
                                        </button>
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="bg-transparent border border-white text-white px-5 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-medium hover:-translate-y-0.5 hover:bg-slate-900 transition-all text-sm md:text-base cursor-pointer"
                                        >
                                            Login to book
                                        </button>

                                    </>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3 md:gap-6 justify-center mt-6 md:mt-10 pt-4 md:pt-6 border-t border-white/10">
                                {['No hidden fees', 'Mobile friendly', '24/7 support', 'Secure & private', 'Instant confirmation'].map(tag => (
                                    <span key={tag} className="text-[10px] md:text-sm text-blue-300 flex items-center gap-1 md:gap-2">
                                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
            <Footer />
        </div>
    );
};

export default Home;