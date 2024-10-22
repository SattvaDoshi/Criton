import jwt from 'jsonwebtoken';
import { connectToTenantDB } from '../config/dbConnection.js';
import { getAlbumModel } from '../models/album.model.js';
import { getPhotoModel } from '../models/photo.model.js';


const createAlbum = async (req, res) => {
  try {
    // Step 1: Ensure the user is authenticated
    if (!req.session || !req.session.token || !req.session.tenantId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { tenantId } = req.session;

    // Step 2: Connect to the tenant's specific database
    const tenantConnection = await connectToTenantDB(tenantId);
    const Album = getAlbumModel(tenantConnection);

    // Step 3: Decode the JWT token to get the userId
    const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Step 4: Create the album
    const { title, photos } = req.body;
    const newAlbum = new Album({
      userId,
      title,
      photos
    });

    // Step 5: Save the album
    await newAlbum.save();

    // Step 6: Send the response
    res.status(201).json({
      message: 'Album created successfully',
      album: newAlbum
    });

  } catch (error) {
    console.error('Error in createAlbum:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAlbums = async (req, res) => {
  try {
    // Step 1: Ensure the user is authenticated
    if (!req.session || !req.session.token || !req.session.tenantId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { tenantId } = req.session;

    // Step 2: Connect to the tenant's specific database
    const tenantConnection = await connectToTenantDB(tenantId);
    const Album = getAlbumModel(tenantConnection);

    // Step 3: Decode the JWT token to get the userId
    const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Step 4: Fetch all albums for the user
    const albums = await Album.find({ userId }).populate('photos');

    // Step 5: Send the response
    res.status(200).json({
      message: 'Albums retrieved successfully',
      albums
    });

  } catch (error) {
    console.error('Error in getAlbums:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    // Step 1: Ensure the user is authenticated
    if (!req.session || !req.session.token || !req.session.tenantId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { tenantId } = req.session;

    // Step 2: Connect to the tenant's specific database
    const tenantConnection = await connectToTenantDB(tenantId);
    const Album = getAlbumModel(tenantConnection);

    // Step 3: Decode the JWT token to get the userId
    const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Step 4: Get the album ID from the request parameters
    const { albumId } = req.params;

    // Step 5: Find and delete the album
    const deletedAlbum = await Album.findOneAndDelete({ _id: albumId, userId });

    if (!deletedAlbum) {
      return res.status(404).json({ message: 'Album not found or you do not have permission to delete it' });
    }

    // Step 6: Send the response
    res.status(200).json({
      message: 'Album deleted successfully',
      deletedAlbum
    });

  } catch (error) {
    console.error('Error in deleteAlbum:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAlbum = async (req, res) => {
    try {
      // Step 1: Ensure the user is authenticated
      if (!req.session || !req.session.token || !req.session.tenantId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
      }
  
      const { tenantId } = req.session;
  
      // Step 2: Connect to the tenant's specific database
      const tenantConnection = await connectToTenantDB(tenantId);
      const Album = getAlbumModel(tenantConnection);
      const Photo = getPhotoModel(tenantConnection);
  
      // Step 3: Decode the JWT token to get the userId
      const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
  
      // Step 4: Get the album ID from the request parameters
      const { albumId } = req.params;
  
      // Step 5: Find the album and populate its photos
      const album = await Album.findOne({ _id: albumId, userId }).populate({
        path: 'photos',
        model: Photo
      });
  
      if (!album) {
        return res.status(404).json({ message: 'Album not found' });
      }
  
      // Step 6: Send the response
      res.status(200).json({
        message: 'Album retrieved successfully',
        album
      });
  
    } catch (error) {
      console.error('Error in getAlbum:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token. Please log in again.' });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }


const addPhotoToAlbum = async (req, res) => {
    try {
      // Step 1: Ensure the user is authenticated
      if (!req.session || !req.session.token || !req.session.tenantId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
      }
  
      const { tenantId } = req.session;
  
      // Step 2: Connect to the tenant's specific database
      const tenantConnection = await connectToTenantDB(tenantId);
      const Album = getAlbumModel(tenantConnection);
      const Photo = getPhotoModel(tenantConnection);
  
      // Step 3: Decode the JWT token to get the userId
      const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
  
      // Step 4: Get the album ID and photo ID from the request
      const { albumId, photoId } = req.params;
  
      // Step 5: Find the album and check if the user owns it
      const album = await Album.findOne({ _id: albumId, userId });
      if (!album) {
        return res.status(404).json({ message: 'Album not found or you do not have permission to modify it' });
      }
  
      // Step 6: Find the photo and check if the user owns it
      const photo = await Photo.findOne({ _id: photoId, userId });
      if (!photo) {
        return res.status(404).json({ message: 'Photo not found or you do not have permission to add it' });
      }
  
      // Step 7: Add the photo to the album if it's not already there
      if (!album.photos.includes(photoId)) {
        album.photos.push(photoId);
        await album.save();
      }
  
      // Step 8: Send the response
      res.status(200).json({
        message: 'Photo added to album successfully',
        album
      });
  
    } catch (error) {
      console.error('Error in addPhotoToAlbum:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token. Please log in again.' });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  const removePhotoFromAlbum = async (req, res) => {
    try {
      // Step 1: Ensure the user is authenticated
      if (!req.session || !req.session.token || !req.session.tenantId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
      }
  
      const { tenantId } = req.session;
  
      // Step 2: Connect to the tenant's specific database
      const tenantConnection = await connectToTenantDB(tenantId);
      const Album = getAlbumModel(tenantConnection);
  
      // Step 3: Decode the JWT token to get the userId
      const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
  
      // Step 4: Get the album ID and photo ID from the request
      const { albumId, photoId } = req.params;
  
      // Step 5: Find the album and check if the user owns it
      const album = await Album.findOne({ _id: albumId, userId });
      if (!album) {
        return res.status(404).json({ message: 'Album not found or you do not have permission to modify it' });
      }
  
      // Step 6: Remove the photo from the album
      album.photos = album.photos.filter(id => id.toString() !== photoId);
      await album.save();
  
      // Step 7: Send the response
      res.status(200).json({
        message: 'Photo removed from album successfully',
        album
      });
  
    } catch (error) {
      console.error('Error in removePhotoFromAlbum:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token. Please log in again.' });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

export {
  createAlbum,
  getAlbums,
  deleteAlbum,
  getAlbum,
  addPhotoToAlbum,
  removePhotoFromAlbum
};