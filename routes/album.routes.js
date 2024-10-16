import { Router } from "express";
import { createAlbum, deleteAlbum, getAlbum, getAlbums } from "../controllers/album.controller.js";

const router = Router();

router.post('/createAlbum',createAlbum)
router.get('/allAlbums',getAlbums)
router.get('/getAlbum',getAlbum)
router.delete('/deleteAlbum',deleteAlbum)


export default router