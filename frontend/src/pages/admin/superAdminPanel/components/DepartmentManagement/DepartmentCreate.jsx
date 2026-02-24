import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDepartment } from "../../../../../context/DepartmentContext";
import toast from "react-hot-toast";
import {

    FiChevronLeft,
    FiClock,
    FiAlertCircle,
    FiCode,
    FiCheckCircle,
    FiShield
} from "react-icons/fi";
import { IoMdCreate } from "react-icons/io";

import {
    FaBuilding,
    FaRegBuilding,
    FaClock,
    FaMapMarkerAlt,
    FaPhoneAlt,
} from "react-icons/fa";
import { MdOutlineContentPaste } from "react-icons/md";

const DepartmentCreate = () => {
    const navigate = useNavigate();
    const { createDepartment } = useDepartment();

    const [activeTab, setActiveTab] = useState("form");
    const [jsonInput, setJsonInput] = useState("");
    const [jsonError, setJsonError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const [formData, setFormData] = useState({
        departmentCategory: "",
        name: "",
        address: {
            street: "",
            city: "",
            district: "",
            state: "",
            pincode: "",
        },
        contact: {
            phone: "",
            email: "",
            website: "",
        },
        workingHours: [
            { day: "Mon", isClosed: false, openTime: "09:00", closeTime: "17:00" },
            { day: "Tue", isClosed: false, openTime: "09:00", closeTime: "17:00" },
            { day: "Wed", isClosed: false, openTime: "09:00", closeTime: "17:00" },
            { day: "Thu", isClosed: false, openTime: "09:00", closeTime: "17:00" },
            { day: "Fri", isClosed: false, openTime: "09:00", closeTime: "17:00" },
            { day: "Sat", isClosed: true, openTime: "", closeTime: "" },
            { day: "Sun", isClosed: true, openTime: "", closeTime: "" },
        ],
        status: "active",
        isSlotBookingEnabled: true,
        bookingWindowDays: 7,
        priorityCriteria: {
            seniorCitizenAge: 60,
            allowPregnantWomen: true,
            allowDifferentlyAbled: true,
        },
    });

    // Department categories
    const departmentCategories = [
        'Municipal Corporation',
        'Police Department',
        'Health Department',
        'Education Department',
        'Transport Department',
        'Revenue Department',
        'Public Works Department',
        'Water Supply Department',
        'Electricity Board',
        'Other'
    ];

    /* ------------------ HELPER FUNCTIONS ------------------ */

    const deepMerge = (target, source) => {
        const output = { ...target };
        Object.keys(source).forEach((key) => {
            if (
                source[key] &&
                typeof source[key] === "object" &&
                !Array.isArray(source[key])
            ) {
                output[key] = deepMerge(target[key] || {}, source[key]);
            } else if (Array.isArray(source[key])) {
                output[key] = [...source[key]];
            } else {
                output[key] = source[key];
            }
        });
        return output;
    };

    const validateJsonInput = (input) => {
        if (!input.trim()) {
            return { valid: false, error: "JSON field is empty" };
        }

        try {
            const parsed = JSON.parse(input);

            if (!parsed.name || !parsed.departmentCategory) {
                return {
                    valid: false,
                    error: "Missing required fields: name and departmentCategory",
                };
            }

            return { valid: true, data: parsed };
        } catch (err) {
            return {
                valid: false,
                error: `Invalid JSON: ${err.message}`,
            };
        }
    };

    /* ------------------ JSON HANDLERS ------------------ */

    const handleValidateJson = () => {
        const result = validateJsonInput(jsonInput);

        if (!result.valid) {
            setJsonError(result.error);
            toast.error(result.error, {
                duration: 6000,
                position: "top-center",
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    border: "1px solid #334155",
                },
            });
            return;
        }

        setJsonError("");
        toast.success("JSON is valid. You can now import it.", {
            duration: 3000,
            position: "top-center",
            icon: "✅",
            style: {
                background: "#1e293b",
                color: "#fff",
                border: "1px solid #334155",
            },
        });
    };

    const handleApplyJsonData = () => {
        const result = validateJsonInput(jsonInput);

        if (!result.valid) {
            setJsonError(result.error);
            toast.error(result.error, {
                duration: 6000,
                position: "top-center",
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    border: "1px solid #334155",
                },
            });
            return;
        }

        setFormData((prev) => deepMerge(prev, result.data));

        toast.success("Department data imported successfully!", {
            duration: 3000,
            position: "top-center",
            icon: "✅",
            style: {
                background: "#1e293b",
                color: "#fff",
                border: "1px solid #334155",
            },
        });

        setJsonInput("");
        setJsonError("");
        setActiveTab("form");
    };

    /* ------------------ WORKING HOURS HANDLER ------------------ */

    const handleWorkingHourChange = (index, field, value) => {
        const updated = [...formData.workingHours];
        updated[index] = { ...updated[index], [field]: value };

        if (field === "isClosed" && value === true) {
            updated[index].openTime = "";
            updated[index].closeTime = "";
        }

        setFormData({ ...formData, workingHours: updated });
    };

    const handleBulkApplyHours = () => {
        const updated = formData.workingHours.map((wh) => {
            if (!wh.isClosed) {
                return { ...wh, openTime: "09:00", closeTime: "17:00" };
            }
            return wh;
        });
        setFormData({ ...formData, workingHours: updated });
        toast.success("Default hours applied to all open days", {
            duration: 2000,
            position: "top-center",
            style: {
                background: "#1e293b",
                color: "#fff",
                border: "1px solid #334155",
            },
        });
    };

    /* ------------------ FORM SUBMIT ------------------ */

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        const errors = {};
        if (!formData.departmentCategory) errors.departmentCategory = 'Department category is required';
        if (!formData.name) errors.name = 'Department name is required';
        if (!formData.address?.street) errors.street = 'Street address is required';
        if (!formData.address?.city) errors.city = 'City is required';
        if (!formData.address?.state) errors.state = 'State is required';
        if (!formData.address?.pincode) errors.pincode = 'Pincode is required';

        // Validate working hours
        formData.workingHours.forEach((wh, index) => {
            if (!wh.isClosed && (!wh.openTime || !wh.closeTime)) {
                errors[`workingHours_${index}`] = `Open and close times required for ${wh.day}`;
            }
        });

        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
            toast.error('Please fill in all required fields', {
                duration: 3000,
                position: "top-center",
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    border: "1px solid #334155",
                },
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await createDepartment(formData);
            navigate("/super-admin-panel/departments");
        } catch (error) {
            toast.error("Failed to create department", {
                duration: 3000,
                position: "top-center",
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    border: "1px solid #334155",
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ------------------ UI ------------------ */

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Simple background */}
            <div className="fixed inset-0 bg-slate-900/90 pointer-events-none z-0"></div>

            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/super-admin-panel/departments')}
                                className="p-2 hover:bg-slate-800 rounded-lg transition-all"
                            >
                                <FiChevronLeft className="w-5 h-5" />
                            </motion.button>
                            <div>
                                <h1 className="text-xl font-bold text-white">
                                    Create Department
                                </h1>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Configure department details
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-5 py-2 text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <>
                                    <IoMdCreate className="w-4 h-4" />
                                    <span>Create</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 px-4 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-1 mb-6 bg-slate-800/50 rounded-lg p-1 border border-slate-700 w-fit">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setActiveTab("form")}
                            className={`px-5 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === "form"
                                    ? "text-white bg-slate-700 shadow-sm"
                                    : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <FaRegBuilding className="w-4 h-4" />
                            <span>Form</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setActiveTab("json")}
                            className={`px-5 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === "json"
                                    ? "text-white bg-slate-700 shadow-sm"
                                    : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <FiCode className="w-4 h-4" />
                            <span>JSON</span>
                        </motion.button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "json" && (
                            <motion.div
                                key="json"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-xl p-6 backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                                        <MdOutlineContentPaste className="w-4 h-4 text-slate-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-white">
                                            Import Department Configuration
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            Paste a complete department JSON configuration
                                        </p>
                                    </div>
                                </div>

                                <textarea
                                    value={jsonInput}
                                    onChange={(e) => {
                                        setJsonInput(e.target.value);
                                        setJsonError("");
                                    }}
                                    className="w-full h-56 bg-slate-900/80 border border-slate-700 p-4 rounded-lg font-mono text-sm text-white placeholder-slate-600 focus:border-slate-600 focus:ring-1 focus:ring-slate-700 outline-none"
                                    placeholder={`{
  "name": "Municipal Office",
  "departmentCategory": "Municipal Corporation",
  "address": {
    "street": "Main Road",
    "city": "City Name",
    "district": "District Name",
    "state": "State Name",
    "pincode": "123456"
  }
}`}
                                />

                                {jsonError && (
                                    <div className="mt-3 p-3 bg-red-900/20 border border-red-800/30 rounded-lg flex items-center gap-2">
                                        <FiAlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                        <p className="text-xs text-red-400">{jsonError}</p>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3 mt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleValidateJson}
                                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-all"
                                    >
                                        Validate JSON
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleApplyJsonData}
                                        className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <FiCheckCircle className="w-4 h-4" />
                                        Import Data
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setJsonInput("");
                                            setJsonError("");
                                        }}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-all border border-slate-700"
                                    >
                                        Clear
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "form" && (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                {/* Basic Information */}
                                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center">
                                            <FaBuilding className="w-4 h-4 text-slate-950" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-white">Basic Information</h3>
                                            <p className="text-xs text-slate-400">Department identity and classification</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                                                <span className="text-red-400">*</span>
                                                Department Category
                                            </label>
                                            <select
                                                value={formData.departmentCategory}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        departmentCategory: e.target.value,
                                                    })
                                                }
                                                className={`w-full px-3 py-2.5 bg-slate-900/80 border text-sm rounded-lg focus:ring-1 outline-none ${validationErrors.departmentCategory
                                                        ? 'border-red-800/50 focus:border-red-700 focus:ring-red-900/30'
                                                        : 'border-slate-700 focus:border-slate-600 focus:ring-slate-700'
                                                    }`}
                                            >
                                                <option value="" className="bg-slate-800">Select category</option>
                                                {departmentCategories.map((cat) => (
                                                    <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                                                ))}
                                            </select>
                                            {validationErrors.departmentCategory && (
                                                <p className="text-xs text-red-400 flex items-center gap-1">
                                                    <FiAlertCircle className="w-3 h-3" />
                                                    {validationErrors.departmentCategory}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                                                <span className="text-red-400">*</span>
                                                Department Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                placeholder="e.g., Municipal Office"
                                                className={`w-full px-3 py-2.5 bg-slate-900/80 border text-sm rounded-lg focus:ring-1 outline-none placeholder-slate-600 ${validationErrors.name
                                                        ? 'border-red-800/50 focus:border-red-700 focus:ring-red-900/30'
                                                        : 'border-slate-700 focus:border-slate-600 focus:ring-slate-700'
                                                    }`}
                                            />
                                            {validationErrors.name && (
                                                <p className="text-xs text-red-400 flex items-center gap-1">
                                                    <FiAlertCircle className="w-3 h-3" />
                                                    {validationErrors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Status</label>
                                                <div className="flex items-center gap-4 p-2 bg-slate-900/80 rounded-lg border border-slate-700">
                                                    <label className="flex items-center gap-1.5">
                                                        <input
                                                            type="radio"
                                                            value="active"
                                                            checked={formData.status === 'active'}
                                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                            className="w-3.5 h-3.5 text-slate-600 bg-slate-800 border-slate-600"
                                                        />
                                                        <span className="text-sm text-slate-300">Active</span>
                                                    </label>
                                                    <label className="flex items-center gap-1.5">
                                                        <input
                                                            type="radio"
                                                            value="inactive"
                                                            checked={formData.status === 'inactive'}
                                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                            className="w-3.5 h-3.5 text-slate-600 bg-slate-800 border-slate-600"
                                                        />
                                                        <span className="text-sm text-slate-300">Inactive</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Booking Window (Days)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="30"
                                                    value={formData.bookingWindowDays}
                                                    onChange={(e) => setFormData({ ...formData, bookingWindowDays: parseInt(e.target.value) })}
                                                    className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 text-sm rounded-lg focus:border-slate-600 focus:ring-1 focus:ring-slate-700 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Slot Booking</label>
                                            <div className="flex items-center gap-4 p-2 bg-slate-900/80 rounded-lg border border-slate-700">
                                                <label className="flex items-center gap-1.5">
                                                    <input
                                                        type="radio"
                                                        checked={formData.isSlotBookingEnabled === true}
                                                        onChange={() => setFormData({ ...formData, isSlotBookingEnabled: true })}
                                                        className="w-3.5 h-3.5 text-slate-600 bg-slate-800 border-slate-600"
                                                    />
                                                    <span className="text-sm text-slate-300">Enabled</span>
                                                </label>
                                                <label className="flex items-center gap-1.5">
                                                    <input
                                                        type="radio"
                                                        checked={formData.isSlotBookingEnabled === false}
                                                        onChange={() => setFormData({ ...formData, isSlotBookingEnabled: false })}
                                                        className="w-3.5 h-3.5 text-slate-600 bg-slate-800 border-slate-600"
                                                    />
                                                    <span className="text-sm text-slate-300">Disabled</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-white/80 rounded-lg flex items-center justify-center">
                                            <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-white">Address Information</h3>
                                            <p className="text-xs text-slate-400">Department physical location</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                                                <span className="text-red-400">*</span>
                                                Street Address
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.address.street}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, street: e.target.value }
                                                    })
                                                }
                                                placeholder="e.g., Market Road"
                                                className={`w-full px-3 py-2.5 bg-slate-900/80 border text-sm rounded-lg focus:ring-1 outline-none placeholder-slate-600 ${validationErrors.street
                                                        ? 'border-red-800/50 focus:border-red-700 focus:ring-red-900/30'
                                                        : 'border-slate-700 focus:border-slate-600 focus:ring-slate-700'
                                                    }`}
                                            />
                                            {validationErrors.street && (
                                                <p className="text-xs text-red-400 flex items-center gap-1">
                                                    <FiAlertCircle className="w-3 h-3" />
                                                    {validationErrors.street}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                                                    <span className="text-red-400">*</span>
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.address.city}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            address: { ...formData.address, city: e.target.value }
                                                        })
                                                    }
                                                    placeholder="City"
                                                    className={`w-full px-3 py-2.5 bg-slate-900/80 border text-sm rounded-lg focus:ring-1 outline-none placeholder-slate-600 ${validationErrors.city
                                                            ? 'border-red-800/50 focus:border-red-700 focus:ring-red-900/30'
                                                            : 'border-slate-700 focus:border-slate-600 focus:ring-slate-700'
                                                        }`}
                                                />
                                                {validationErrors.city && (
                                                    <p className="text-xs text-red-400 flex items-center gap-1">
                                                        <FiAlertCircle className="w-3 h-3" />
                                                        {validationErrors.city}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">District</label>
                                                <input
                                                    type="text"
                                                    value={formData.address.district}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            address: { ...formData.address, district: e.target.value }
                                                        })
                                                    }
                                                    placeholder="District"
                                                    className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 text-sm rounded-lg focus:border-slate-600 focus:ring-1 focus:ring-slate-700 outline-none placeholder-slate-600"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                                                    <span className="text-red-400">*</span>
                                                    State
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.address.state}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            address: { ...formData.address, state: e.target.value }
                                                        })
                                                    }
                                                    placeholder="State"
                                                    className={`w-full px-3 py-2.5 bg-slate-900/80 border text-sm rounded-lg focus:ring-1 outline-none placeholder-slate-600 ${validationErrors.state
                                                            ? 'border-red-800/50 focus:border-red-700 focus:ring-red-900/30'
                                                            : 'border-slate-700 focus:border-slate-600 focus:ring-slate-700'
                                                        }`}
                                                />
                                                {validationErrors.state && (
                                                    <p className="text-xs text-red-400 flex items-center gap-1">
                                                        <FiAlertCircle className="w-3 h-3" />
                                                        {validationErrors.state}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                                                    <span className="text-red-400">*</span>
                                                    Pincode
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.address.pincode}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            address: { ...formData.address, pincode: e.target.value }
                                                        })
                                                    }
                                                    placeholder="Pincode"
                                                    className={`w-full px-3 py-2.5 bg-slate-900/80 border text-sm rounded-lg focus:ring-1 outline-none placeholder-slate-600 ${validationErrors.pincode
                                                            ? 'border-red-800/50 focus:border-red-700 focus:ring-red-900/30'
                                                            : 'border-slate-700 focus:border-slate-600 focus:ring-slate-700'
                                                        }`}
                                                />
                                                {validationErrors.pincode && (
                                                    <p className="text-xs text-red-400 flex items-center gap-1">
                                                        <FiAlertCircle className="w-3 h-3" />
                                                        {validationErrors.pincode}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                            <FaPhoneAlt className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-white">Contact Information</h3>
                                            <p className="text-xs text-slate-400">Department communication details</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={formData.contact.phone}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        contact: { ...formData.contact, phone: e.target.value }
                                                    })
                                                }
                                                placeholder="+91-XXXXXXXXXX"
                                                className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 text-sm rounded-lg focus:border-slate-600 focus:ring-1 focus:ring-slate-700 outline-none placeholder-slate-600"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Email Address</label>
                                            <input
                                                type="email"
                                                value={formData.contact.email}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        contact: { ...formData.contact, email: e.target.value }
                                                    })
                                                }
                                                placeholder="contact@department.gov"
                                                className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 text-sm rounded-lg focus:border-slate-600 focus:ring-1 focus:ring-slate-700 outline-none placeholder-slate-600"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Website</label>
                                            <input
                                                type="url"
                                                value={formData.contact.website}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        contact: { ...formData.contact, website: e.target.value }
                                                    })
                                                }
                                                placeholder="https://"
                                                className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 text-sm rounded-lg focus:border-slate-600 focus:ring-1 focus:ring-slate-700 outline-none placeholder-slate-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Working Hours */}
                                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center">
                                                <FaClock className="w-4 h-4 text-slate-900" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold text-white">Working Hours</h3>
                                                <p className="text-xs text-slate-400">Department operational schedule</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={handleBulkApplyHours}
                                            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-all flex items-center gap-1.5"
                                        >
                                            <FiClock className="w-3 h-3" />
                                            Default Hours
                                        </motion.button>
                                    </div>

                                    <div className="space-y-2">
                                        {formData.workingHours.map((wh, index) => (
                                            <div
                                                key={wh.day}
                                                className="flex flex-col xs:flex-row xs:items-center gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                                            >
                                                <div className="flex items-center justify-between xs:w-28">
                                                    <span className="text-sm font-semibold text-slate-300">{wh.day}</span>
                                                    <label className="flex items-center gap-1.5 xs:ml-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={wh.isClosed}
                                                            onChange={(e) => handleWorkingHourChange(index, 'isClosed', e.target.checked)}
                                                            className="w-3.5 h-3.5 text-slate-600 bg-slate-800 border-slate-600 rounded"
                                                        />
                                                        <span className="text-xs text-slate-400">Closed</span>
                                                    </label>
                                                </div>

                                                {!wh.isClosed ? (
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <input
                                                            type="time"
                                                            value={wh.openTime}
                                                            onChange={(e) => handleWorkingHourChange(index, 'openTime', e.target.value)}
                                                            className="flex-1 px-2 py-1.5 bg-slate-800 border border-slate-700 text-white text-xs rounded-lg focus:border-slate-600 focus:ring-1 focus:ring-slate-700 outline-none"
                                                        />
                                                        <span className="text-slate-500 text-xs">to</span>
                                                        <input
                                                            type="time"
                                                            value={wh.closeTime}
                                                            onChange={(e) => handleWorkingHourChange(index, 'closeTime', e.target.value)}
                                                            className="flex-1 px-2 py-1.5 bg-slate-800 border border-slate-700 text-white text-xs rounded-lg focus:border-slate-600 focus:ring-1 focus:ring-slate-700 outline-none"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 px-2 py-1.5 text-xs text-slate-500 italic">
                                                        — Closed
                                                    </div>
                                                )}

                                                {validationErrors[`workingHours_${index}`] && (
                                                    <p className="text-xs text-red-400 flex items-center gap-1">
                                                        <FiAlertCircle className="w-3 h-3" />
                                                        {validationErrors[`workingHours_${index}`]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Priority Criteria */}
                                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                                            <FiShield className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-white">Priority Criteria</h3>
                                            <p className="text-xs text-slate-400">Special citizen priority settings</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Senior Citizen Age</label>
                                            <input
                                                type="number"
                                                min="50"
                                                max="100"
                                                value={formData.priorityCriteria.seniorCitizenAge}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        priorityCriteria: {
                                                            ...formData.priorityCriteria,
                                                            seniorCitizenAge: parseInt(e.target.value)
                                                        }
                                                    })
                                                }
                                                className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 text-sm rounded-lg focus:border-slate-600 focus:ring-1 focus:ring-slate-700 outline-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Pregnant Women</label>
                                                <div className="flex items-center gap-4 p-2 bg-slate-900/80 rounded-lg border border-slate-700">
                                                    <label className="flex items-center gap-1.5">
                                                        <input
                                                            type="radio"
                                                            checked={formData.priorityCriteria.allowPregnantWomen === true}
                                                            onChange={() =>
                                                                setFormData({
                                                                    ...formData,
                                                                    priorityCriteria: {
                                                                        ...formData.priorityCriteria,
                                                                        allowPregnantWomen: true
                                                                    }
                                                                })
                                                            }
                                                            className="w-3.5 h-3.5 text-slate-600 bg-slate-800 border-slate-600"
                                                        />
                                                        <span className="text-sm text-slate-300">Allow</span>
                                                    </label>
                                                    <label className="flex items-center gap-1.5">
                                                        <input
                                                            type="radio"
                                                            checked={formData.priorityCriteria.allowPregnantWomen === false}
                                                            onChange={() =>
                                                                setFormData({
                                                                    ...formData,
                                                                    priorityCriteria: {
                                                                        ...formData.priorityCriteria,
                                                                        allowPregnantWomen: false
                                                                    }
                                                                })
                                                            }
                                                            className="w-3.5 h-3.5 text-slate-600 bg-slate-800 border-slate-600"
                                                        />
                                                        <span className="text-sm text-slate-300">Disallow</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Differently Abled</label>
                                                <div className="flex items-center gap-4 p-2 bg-slate-900/80 rounded-lg border border-slate-700">
                                                    <label className="flex items-center gap-1.5">
                                                        <input
                                                            type="radio"
                                                            checked={formData.priorityCriteria.allowDifferentlyAbled === true}
                                                            onChange={() =>
                                                                setFormData({
                                                                    ...formData,
                                                                    priorityCriteria: {
                                                                        ...formData.priorityCriteria,
                                                                        allowDifferentlyAbled: true
                                                                    }
                                                                })
                                                            }
                                                            className="w-3.5 h-3.5 text-slate-600 bg-slate-800 border-slate-600"
                                                        />
                                                        <span className="text-sm text-slate-300">Allow</span>
                                                    </label>
                                                    <label className="flex items-center gap-1.5">
                                                        <input
                                                            type="radio"
                                                            checked={formData.priorityCriteria.allowDifferentlyAbled === false}
                                                            onChange={() =>
                                                                setFormData({
                                                                    ...formData,
                                                                    priorityCriteria: {
                                                                        ...formData.priorityCriteria,
                                                                        allowDifferentlyAbled: false
                                                                    }
                                                                })
                                                            }
                                                            className="w-3.5 h-3.5 text-slate-600 bg-slate-800 border-slate-600"
                                                        />
                                                        <span className="text-sm text-slate-300">Disallow</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="button"
                                        onClick={() => navigate('/super-admin-panel/departments')}
                                        className="px-5 py-2.5 text-sm font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all border border-slate-700"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2.5 text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Creating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <IoMdCreate className="w-4 h-4" />
                                                <span>Create Department</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default DepartmentCreate;