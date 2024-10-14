import { Router } from "express";
import { addPhoto, deletePhoto, getPhoto } from "../controllers/photo.controller.js";

const router = Router();

router.post('/addPhoto',addPhoto);
router.get('/getPhoto',getPhoto);
router.delete('/deletePhoto',deletePhoto);


export default router