import upload from '../utils/multer.js';

export const uploadPhotos = upload.fields([
  { name: 'photoUrl1', maxCount: 1 },
  { name: 'photoUrl2', maxCount: 1 }
]);

export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Max size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  
  if (err.message === 'Error: Images Only!') {
    return res.status(400).json({ message: 'Only image files are allowed.' });
  }

  console.error('Unexpected error in file upload:', err);
  res.status(500).json({ message: 'An unexpected error occurred during file upload.' });
};