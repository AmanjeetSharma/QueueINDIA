import { Booking } from '../models/booking.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryFile.js';








// Upload documents for a booking
const uploadDocuments = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { documents } = req.body; // Array of document objects

        // Find booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user owns this booking
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access to booking'
            });
        }

        // Check if booking is in PENDING_DOCS status
        if (booking.status !== 'PENDING_DOCS') {
            return res.status(400).json({
                success: false,
                message: `Cannot upload documents. Current status: ${booking.status}`
            });
        }

        // Process each document
        const uploadedDocs = [];

        for (const doc of documents) {
            // Upload to Cloudinary
            const cloudinaryResult = await uploadToCloudinary(
                doc.base64Content, // Expecting base64 string
                `queueindia/bookings/${bookingId}/documents`
            );

            uploadedDocs.push({
                name: doc.name,
                description: doc.description || '',
                isMandatory: doc.isMandatory || true,
                documentUrl: cloudinaryResult.url,
                status: 'PENDING'
            });
        }

        // Update booking
        booking.submittedDocs = uploadedDocs;
        booking.status = 'DOCS_SUBMITTED';
        booking.updatedAt = Date.now();

        await booking.save();

        // Populate user and department info
        await booking.populate([
            { path: 'user', select: 'name email phone' },
            { path: 'department', select: 'name serviceCode' }
        ]);

        res.status(200).json({
            success: true,
            message: 'Documents uploaded successfully',
            data: booking
        });

    } catch (error) {
        console.error('Document upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload documents'
        });
    }
};














// Get document requirements for a booking
const getDocumentRequirements = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId)
            .select('submittedDocs status metadata')
            .populate('service.serviceId', 'requiredDocs');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Get required docs from service
        const requiredDocs = booking.service?.serviceId?.requiredDocs || [];

        res.status(200).json({
            success: true,
            data: {
                requiredDocs,
                submittedDocs: booking.submittedDocs,
                status: booking.status,
                isDocumentUploadRequired: booking.metadata.serviceRequiresDocs
            }
        });

    } catch (error) {
        console.error('Get document requirements error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch document requirements'
        });
    }
};
















export {
    uploadDocuments,
    getDocumentRequirements
};