import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  photoUrl1: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/\S+/.test(v);
      },
      message: 'Invalid URL format for photoUrl1'
    }
  },
  photoUrl2: { 
    type: String,
    validate: {
      validator: function(v) {
        return v === null || /^https?:\/\/\S+/.test(v);
      },
      message: 'Invalid URL format for photoUrl2'
    }
  },
  title: { 
    type: String, 
  },
  description: { 
    type: String,
    maxlength: 500
  },
  product_type: { 
    type: String,
    maxlength: 100
  },
  sku_code: { 
    type: String,
    maxlength: 50
  },
  resolution: { 
    type: String 
  },
  material_type: { 
    type: String 
  },
  size: { 
    type: String 
  },
  weight: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const getPhotoModel = (connection) => connection.model('Photo', photoSchema);