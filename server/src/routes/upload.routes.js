import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import { uploadVideo } from '../controllers/upload.controller.js';
const router = express.Router();

// POST /api/v1/upload/video
router.post('/video', upload.single('video'), uploadVideo);

export default router;
