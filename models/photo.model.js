import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  url: { 
    type: String, 
    validate: {
      validator: function(v) {
        return /^https?:\/\/\S+/.test(v); // Ensures the URL starts with http or https
      },
      message: 'Invalid URL format'
    }
  },
  title: { 
    type: String, 
  },
  description: { 
    type: String,
    maxlength: 500 // Limiting description length to 500 characters
  },
  product_type: { 
    type: String,
    maxlength: 100 // Optional, with a limit to avoid overly long entries
  },
  sku_code: { 
    type: String,
    maxlength: 50 // SKU code length capped for consistency
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

export const getPhotoModel = (connection) => connection.model('Photo', photoSchema)