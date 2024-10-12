import { getUserModel } from '../models/user.model.js';
import { getSettingModel } from '../models/setting.model.js';
import { connectToTenantDB } from '../utils/dbConnection.js';
import jwt from 'jsonwebtoken';
import { initializeUserSettings, settingsValidation } from '../utils/helper.js';


const getUserSettings = async (req, res) => {
    try {
      // Step 1: Ensure the user is authenticated
      if (!req.session || !req.session.token || !req.session.tenantId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
      }
  
      const { tenantId } = req.session;
  
      // Step 2: Connect to the tenant's specific database
      const tenantConnection = await connectToTenantDB(tenantId);
      const User = getUserModel(tenantConnection);
      const Setting = getSettingModel(tenantConnection);
  
      // Step 3: Decode the JWT token to get the userId
      const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
  
      // Step 4: Find the user in the tenant's database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Step 5: Fetch the user's settings
      let userSettings = await Setting.findOne({ userId });
  
      // Step 6: If settings don't exist, initialize default settings
      if (!userSettings) {
        userSettings = await initializeUserSettings(userId, tenantConnection);
      }
  
      // Step 7: Send the response
      res.status(200).json({
        message: 'User settings retrieved successfully',
        settings: userSettings
      });
  
    } catch (error) {
      console.error('Get user settings failed:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token. Please log in again.' });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  const updateUserSettings = async (req, res) => {
    try {
      // Step 1: Ensure the user is authenticated
      if (!req.session || !req.session.token || !req.session.tenantId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
      }
  
      const { tenantId } = req.session;
  
      // Step 2: Connect to the tenant's specific database
      const tenantConnection = await connectToTenantDB(tenantId);
      const User = getUserModel(tenantConnection);
      const Setting = getSettingModel(tenantConnection);
  
      // Step 3: Decode the JWT token to get the userId
      const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
  
      // Step 4: Find the user in the tenant's database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Step 5: Fetch the user's current settings
      let userSettings = await Setting.findOne({ userId });
  
      // Step 6: If settings don't exist, initialize default settings
      if (!userSettings) {
        userSettings = await initializeUserSettings(userId, tenantConnection);
      }
  
      // Step 7: Update the settings
      const updatedSettings = req.body;
  
      // Validate and update each section
      for (const section in updatedSettings) {
        if (!settingsValidation.hasOwnProperty(section)) {
          return res.status(400).json({ message: `Invalid section: ${section}` });
        }
  
        for (const key in updatedSettings[section]) {
          if (!settingsValidation[section].hasOwnProperty(key)) {
            return res.status(400).json({ message: `Invalid setting: ${section}.${key}` });
          }
  
          const newValue = updatedSettings[section][key];
          if (!settingsValidation[section][key](newValue)) {
            return res.status(400).json({ message: `Invalid value for ${section}.${key}: ${newValue}` });
          }
  
          userSettings[section][key] = newValue;
        }
      }
  
      // Save the updated settings
      await userSettings.save();
  
      // Step 8: Send the response
      res.status(200).json({
        message: 'User settings updated successfully',
        settings: userSettings
      });
  
    } catch (error) {
      console.error('Update user settings failed:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token. Please log in again.' });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  export {
    getUserSettings,
    updateUserSettings
  }