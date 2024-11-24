import express from 'express';
import { uploadPhotos, handleUploadError } from '../middlewares/upload.middleware.js';
import { addPhoto, deletePhoto, getPhoto, getPhotos } from '../controllers/photo.controller.js';

const router = express.Router();

router.post('/upload/:tenantId/:userId', uploadPhotos, addPhoto, handleUploadError);
router.get('/getPhoto/:tenantId/:photoId',getPhoto);
router.delete('/deletePhoto/:tenantId/:photoId',deletePhoto);
router.get('/allPhotos/:tenantId',getPhotos);

export default router