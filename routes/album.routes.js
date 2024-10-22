import { Router } from "express";
import { addPhotoToAlbum, createAlbum, deleteAlbum, getAlbum, getAlbums, removePhotoFromAlbum } from "../controllers/album.controller.js";

const router = Router();

router.post('/createAlbum',createAlbum)
router.get('/allAlbums',getAlbums)
router.get('/getAlbum/:albumId',getAlbum)
router.delete('/deleteAlbum/:albumId',deleteAlbum)
router.post('/:albumId/photos/:photoId', addPhotoToAlbum);
router.delete('/:albumId/photos/:photoId', removePhotoFromAlbum);


export default router