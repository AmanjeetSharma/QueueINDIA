import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import sharp from "sharp";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folder = "") => {
    try {
        if (!localFilePath) {
            return null;
        }

        // Generate a temporary compressed filename
        const compressedPath = localFilePath.replace(/(\.\w+)$/, "-compressed$1");

        // ✅ Compress image before upload
        await sharp(localFilePath)
            .resize({
                width: 800,   // Prevent giant uploads (mobile camera images)
                withoutEnlargement: true,
            })
            .jpeg({ quality: 60 }) // ~200–400KB output
            .toFile(compressedPath);

        const options = {
            resource_type: "image",
        };

        if (folder) {
            options.folder = folder;
        }

        // ✅ Upload the compressed file instead of the original
        const result = await cloudinary.uploader.upload(compressedPath, options);

        console.log("✅ File uploaded to Cloudinary:", result.secure_url);

        // 🧹 Cleanup: remove both files
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        if (fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);

        return result.secure_url;

    } catch (error) {
        console.error("❌ Cloudinary upload failed:", error.message);

        // Cleanup in case of failure
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return null;
    }
};

export { uploadOnCloudinary };
