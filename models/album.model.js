import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  photos: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Photo' 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const getAlbumModel = (connection) => connection.model('Album', albumSchema)