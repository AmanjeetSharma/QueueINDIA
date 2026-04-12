import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ChevronRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">

                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Building2 className="w-6 h-6 text-blue-400" />
                            <span className="text-xl font-bold text-white">SlotBooking</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                            Skip the queue. Book your slot in minutes. Government and civic services made easy.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/departments" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3" />
                                    Departments
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3" />
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3" />
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Services</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/departments" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3" />
                                    Book Appointment
                                </Link>
                            </li>
                            <li>
                                <Link to="/how-things-work" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3" />
                                    How Things Work
                                </Link>
                            </li>
                            <li>
                                <Link to="/pricing" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3" />
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-slate-400">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>123 Lovely Professional University, Phagwara, Punjab - 144411</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <Phone className="w-4 h-4" />
                                <a href="tel:+911234567890" className="hover:text-blue-400 transition-colors">+91 12345 67890</a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <Mail className="w-4 h-4" />
                                <a href="mailto:support@QueueINDIA.com" className="hover:text-blue-400 transition-colors">support@QueueINDIA.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-800 mt-8 md:mt-10 pt-6 md:pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-slate-500 text-center md:text-left">
                            © {currentYear} QueueINDIA. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                            <Link to="/privacy-policy" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms-of-service" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;