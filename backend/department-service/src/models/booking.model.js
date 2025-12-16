import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
                name: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    default: ""
                },
                isMandatory: {
                    type: Boolean,
                    default: true
                },
                documentUrl: {
                    type: String,
                    required: true
                },
                status: {
                    type: String,
                    enum: ["PENDING", "APPROVED", "REJECTED"],
                    default: "PENDING"
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

        priorityType: {
            type: String,
            enum: ["NONE", "SENIOR_CITIZEN", "PREGNANT_WOMEN", "DIFFERENTLY_ABLED"],
            default: "NONE"
        },

        tokenNumber: {
            type: Number,
            default: null
        },

        estimatedServiceTime: {
            type: Number, // in minutes
            default: null
        },

        notes: {
            type: String,
            default: ""
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

// Indexes for faster queries
bookingSchema.index({ department: 1, date: 1, slotTime: 1 });
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ department: 1, service: 1, date: 1 });
bookingSchema.index({ tokenNumber: 1, department: 1, date: 1 }, { unique: true, sparse: true });

// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function () {
    return this.date;
});

// Virtual for slot display
bookingSchema.virtual('slotDisplay').get(function () {
    return this.slotTime.replace('-', ' - ');
});

export const Booking = mongoose.model("Booking", bookingSchema);