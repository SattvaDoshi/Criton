import jwt from 'jsonwebtoken';
import { connectToTenantDB } from '../config/dbConnection.js';
import { getPhotoModel } from '../models/photo.model.js';

const addPhoto = async (req, res) => {
  try {
    // Step 1: Ensure the user is authenticated
    if (!req.session || !req.session.token || !req.session.tenantId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { tenantId } = req.session;

    // Step 2: Connect to the tenant's specific database
    const tenantConnection = await connectToTenantDB(tenantId);
    const Photo = getPhotoModel(tenantConnection);

    // Step 3: Decode the JWT token to get the userId
    const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Step 4: Check if files are uploaded
    if (!req.files || (!req.files['photoUrl1'] && !req.files['photoUrl2'])) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Step 5: Prepare photo data
    const photoData = {
      userId,
      title: req.body.title,
      description: req.body.description,
      product_type: req.body.product_type,
      sku_code: req.body.sku_code,
      resolution: req.body.resolution,
      material_type: req.body.material_type,
      size: req.body.size,
      weight: req.body.weight
    };

    if (req.files['photoUrl1']) {
      photoData.photoUrl1 = req.files['photoUrl1'][0].path;
    }

    if (req.files['photoUrl2']) {
      photoData.photoUrl2 = req.files['photoUrl2'][0].path;
    }

    // Step 6: Create and save the new photo
    const newPhoto = new Photo(photoData);
    await newPhoto.save();

    // Step 7: Send the response
    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo: newPhoto
    });

  } catch (error) {
    console.error('Error in addPhoto:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPhoto = async (req, res) => {
  try {
    // Step 1: Ensure the user is authenticated
    if (!req.session || !req.session.token || !req.session.tenantId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { tenantId } = req.session;

    // Step 2: Connect to the tenant's specific database
    const tenantConnection = await connectToTenantDB(tenantId);
    const Photo = getPhotoModel(tenantConnection);

    // Step 3: Decode the JWT token to get the userId
    const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Step 4: Get the photo ID from the request parameters
    const { photoId } = req.params;

    // Step 5: Find the photo in the database
    const photo = await Photo.findOne({ _id: photoId, userId });

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Step 6: Send the response
    res.status(200).json({
      message: 'Photo retrieved successfully',
      photo
    });

  } catch (error) {
    console.error('Error in getPhoto:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deletePhoto = async (req, res) => {
  try {
    // Step 1: Ensure the user is authenticated
    if (!req.session || !req.session.token || !req.session.tenantId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { tenantId } = req.session;

    // Step 2: Connect to the tenant's specific database
    const tenantConnection = await connectToTenantDB(tenantId);
    const Photo = getPhotoModel(tenantConnection);

    // Step 3: Decode the JWT token to get the userId
    const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Step 4: Get the photo ID from the request parameters
    const { photoId } = req.params;

    // Step 5: Find and delete the photo
    const deletedPhoto = await Photo.findOneAndDelete({ _id: photoId, userId });

    if (!deletedPhoto) {
      return res.status(404).json({ message: 'Photo not found or you do not have permission to delete it' });
    }

    // Step 6: Send the response
    res.status(200).json({
      message: 'Photo deleted successfully',
      deletedPhoto
    });

  } catch (error) {
    console.error('Error in deletePhoto:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  addPhoto,
  getPhoto,
  deletePhoto
};