import express from 'express';
import { uploadPhotos, handleUploadError } from '../middlewares/upload.middleware.js';
import { addPhoto, deletePhoto, getPhoto, getPhotos } from '../controllers/photo.controller.js';

const router = express.Router();

router.post('/upload/:tenantId', uploadPhotos, addPhoto, handleUploadError);
router.get('/getPhoto/:tenantId/:photoId',getPhoto);
router.delete('/deletePhoto/:tenantId',deletePhoto);
router.get('/allPhotos/:tenantId',getPhotos);

export default router