import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },

    service: {
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        serviceCode: {
            type: String,
            required: true
        }
    },

    date: {
        type: String, // Format: "2025-11-21"
        required: true
    },

    slotTime: {
        type: String, // Format: "10:00-11:00" (start-end)
        required: true
    },

    slotWindow: {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        },
        maxTokens: {
            type: Number,
            required: true
        }
    },

    submittedDocs: [
        {
            requiredDocId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },

            name: { type: String, required: true },
            description: { type: String, default: "" },

            documentUrl: {
                type: String,
                default: null
            },

            uploadedAt: {
                type: Date,
                default: null
            },

            status: {
                type: String,
                enum: ["NOT_UPLOADED", "PENDING", "APPROVED", "REJECTED"],
                default: "NOT_UPLOADED"
            },

            rejectionReason: {
                type: String,
                default: ""
            }
        }
    ],


    status: {
        type: String,
        enum: [
            "PENDING_DOCS",      // Waiting for document upload
            "DOCS_SUBMITTED",    // Documents uploaded, awaiting review
            "UNDER_REVIEW",      // Documents being reviewed
            "APPROVED",          // Approved, token assigned
            "REJECTED",          // Rejected
            "CANCELLED",         // User cancelled
            "COMPLETED"          // Service completed
        ],
        default: "PENDING_DOCS"
    },
    bookingRejectionReason: {
        type: String,
        default: ""
    },

    priorityType: {
        type: String,
        enum: ["NONE", "SENIOR_CITIZEN", "PREGNANT_WOMEN", "DIFFERENTLY_ABLED"],
        default: "NONE"
    },

    estimatedServiceTime: {
        type: Number, // in minutes
        default: null
    },

    bookingDescription: {
        type: String,
        trim: true,
        minlength: 10
    },

    additionalNotes: {
        type: String,
        trim: true,
        maxlength: 500
    },

    metadata: {
        queueType: {
            type: String,
            enum: ["Online", "Offline", "Hybrid"],
            default: "Hybrid"
        },
        isDocumentUploadRequired: {
            type: Boolean,
            default: true
        },
        departmentName: {
            type: String,
            required: true
        },
        serviceRequiresDocs: {
            type: Boolean,
            default: true
        }
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);






bookingSchema.virtual('requiresDocumentUpload').get(function () {
    return this.status === 'PENDING_DOCS' && this.metadata.serviceRequiresDocs;
});

// pre-save hook to handle document requirement
bookingSchema.pre('save', function (next) {
    if (!this.metadata.serviceRequiresDocs && this.status === 'PENDING_DOCS') {
        this.status = 'DOCS_SUBMITTED';
    }
    next();
});





// Indexes for faster queries
// 1️⃣ Slot availability + booking creation (MOST IMPORTANT)
bookingSchema.index({ department: 1, "service.serviceId": 1, date: 1, slotTime: 1, status: 1 });
// 2️⃣ Officer / admin dashboards (user-wise + status filters)
bookingSchema.index({ user: 1, status: 1, createdAt: -1 });
// 3️⃣ Department-level listing (pagination + filters)
bookingSchema.index({ department: 1, status: 1, createdAt: -1 });
// 4️⃣ Prevent duplicate bookings by same user for same slot
bookingSchema.index({ user: 1, department: 1, date: 1, slotTime: 1 });


// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function () {
    return this.date;
});

// Virtual for slot display
bookingSchema.virtual('slotDisplay').get(function () {
    return this.slotTime.replace('-', ' - ');
});

// helps in preventing duplicate bookings by same user for same slot
const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);


export { Booking };