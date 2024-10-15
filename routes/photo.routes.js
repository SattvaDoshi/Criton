import express from 'express';
import { uploadPhotos, handleUploadError } from '../middlewares/upload.middleware.js';
import { addPhoto, deletePhoto, getPhoto } from '../controllers/photo.controller.js';

const router = express.Router();

router.post('/upload', uploadPhotos, addPhoto, handleUploadError);
router.get('/getPhoto',getPhoto);
router.delete('/deletePhoto',deletePhoto);


export default router