import { Router } from "express";
import { addPhotoToAlbum, createAlbum, deleteAlbum, getAlbum, getAlbums, removePhotoFromAlbum } from "../controllers/album.controller.js";

const router = Router();

router.post('/createAlbum/:tenantId',createAlbum)
router.get('/allAlbums/:tenantId',getAlbums)
router.get('/getAlbum/:tenantId/:albumId',getAlbum)
router.delete('/deleteAlbum/:tenantId/:albumId',deleteAlbum)
router.post('/:tenantId/:albumId/photos/:photoId', addPhotoToAlbum);
router.delete('/:tenantId/:albumId/photos/:photoId', removePhotoFromAlbum);


export default router