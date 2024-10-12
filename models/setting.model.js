import mongoose from 'mongoose';

// Schema for background settings
const backgroundSchema = new mongoose.Schema({
  watermark: { 
    type: Boolean, 
    default: false 
  },
  color: { 
    type: String, 
    default: 'white',  
    enum: ['white', 'black', 'blue', 'red']  // Limit color choices
  }
});

// Schema for turning table settings
const turningTableSchema = new mongoose.Schema({
  bluetooth: { 
    type: String, 
    enum: ['enabled', 'disabled'],  
    default: 'disabled' 
  },
  angle: { 
    type: String, 
    enum: ['0', '90', '180','360'], 
    default: '0' 
  },
  speed: { 
    type: String, 
    enum: ['slow', 'medium', 'fast'],  
    default: 'medium' 
  }
});

// Schema for capture settings
const captureSchema = new mongoose.Schema({
  autoFocus: { 
    type: Boolean, 
    default: true  
  },
  zoom: { 
    type: Number, 
    min: 1, 
    max: 5,  
    default: 3  // Default zoom level
  },
  aiEnhancement: { 
    type: Boolean, 
    default: false  
  },
  autoPhoto: { 
    type: Boolean, 
    default: true  
  },
  preset: { 
    type: String, 
    enum: ['portrait', 'landscape', 'macro', 'night'],  
    default: 'portrait'  
  }
});

// Main settings schema
const settingsSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true  // Every setting belongs to a user
  },

  // Nested schemas
  background: {
    type: backgroundSchema,
    default: {}  
  },
  turning_table: {
    type: turningTableSchema,
    default: {}  
  },
  capture: {
    type: captureSchema,
    default: {}  
  },

  createdAt: { 
    type: Date, 
    default: Date.now  
  }
});

export const getSettingModel = (connection) => connection.model('Setting', settingsSchema);
