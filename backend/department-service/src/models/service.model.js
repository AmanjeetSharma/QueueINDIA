import mongoose, { Schema } from "mongoose";




const documentRequirementSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        isMandatory: { type: Boolean, default: true }
    },
    { _id: true }
);









// Token Management Schema (Embed inside Department)
const tokenManagementSchema = new Schema(
    {
        maxDailyServiceTokens: { type: Number, default: null },
        maxTokensPerSlot: { type: Number, default: 10 },
        queueType: {
            type: String,
            enum: ["Online", "Offline", "Hybrid"],
            default: "Hybrid"
        },

        timeBtwEverySlot: { type: Number, default: 15 },

        slotStartTime: { type: String, default: "10:00" },
        slotEndTime: { type: String, default: "17:00" },

        slotWindows: [
            {
                start: { type: String, required: true }, // "10:00"
                end: { type: String, required: true },   // "12:00"
                maxTokens: { type: Number, required: true, default: 10 }
            }
        ],
    },
    { _id: false }
);








// Service Schema
const serviceSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        serviceCode: { type: String, required: true, uppercase: true, trim: true },
        description: { type: String, trim: true },
        priorityAllowed: { type: Boolean, default: true },
        isDocumentUploadRequired: { type: Boolean, default: true },

        tokenManagement: tokenManagementSchema,
        requiredDocs: [documentRequirementSchema],

    },
    { _id: true }
);
export default serviceSchema;