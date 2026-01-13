import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 'lms_videos',
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ success: false, message: 'Cloudinary upload failed', error });
        }
        return res.status(200).json({ success: true, url: result.secure_url, public_id: result.public_id });
      }
    );
    // Pipe the buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(result);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
