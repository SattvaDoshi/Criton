import { getSettingModel } from "../models/setting.model.js";
import { Tenant } from "../models/tenant.model.js";
import { getUserModel } from "../models/user.model.js";
import { connectToTenantDB } from "./dbConnection.js";

const emailExistsInTenants = async (email) => {
  try {
    const allTenants = await Tenant.find({}, { tenantId: 1 });

    for (const tenant of allTenants) {
      if (!tenant || !tenant.tenantId) continue;

      try {
        const tenantConnection = await connectToTenantDB(tenant.tenantId);
        const User = getUserModel(tenantConnection);

        const userExists = await User.findOne({ email });
        if (userExists) {
          return true; // Email exists in this tenant's database
        }
      } catch (error) {
        console.error(`Failed to check tenant database: ${tenant.tenantId}`, error);
        // Continue checking other tenants even if one fails
      }
    }

    return false; // Email doesn't exist in any tenant's database
  } catch (error) {
    console.error('Error while checking email in tenants:', error);
    throw new Error('Failed to check email across tenants');
  }
};
const getTenantByEmail = async (email) => {
  // Search for the tenant in the main tenant database using the email
  const tenant = await Tenant.findOne({ email });
  return tenant;
};

const initializeUserSettings = async (userId, connection) => {
  const Setting = getSettingModel(connection);

  const defaultSettings = new Setting({
    userId: userId,
    background: {
      watermark: false,
      color: 'white'
    },
    turning_table: {
      bluetooth: 'disabled',
      angle: '0',
      speed: 'medium'
    },
    capture: {
      autoFocus: true,
      zoom: 3,
      aiEnhancement: false,
      autoPhoto: true,
      preset: 'portrait'
    }
  });
  try {
    await defaultSettings.save();
    console.log(`Default settings initialized for user: ${userId}`);
  } catch (error) {
    console.error('Failed to initialize default settings:', error);
    throw new Error('Failed to initialize default settings');
  }
};


const settingsValidation = {
  background: {
    watermark: (value) => typeof value === 'boolean',
    color: (value) => ['white', 'black', 'blue', 'red'].includes(value)
  },
  turning_table: {
    bluetooth: (value) => ['enabled', 'disabled'].includes(value),
    angle: (value) => ['0', '90', '180', '360'].includes(value),
    speed: (value) => ['slow', 'medium', 'fast'].includes(value)
  },
  capture: {
    autoFocus: (value) => typeof value === 'boolean',
    zoom: (value) => Number.isInteger(value) && value >= 1 && value <= 5,
    aiEnhancement: (value) => typeof value === 'boolean',
    autoPhoto: (value) => typeof value === 'boolean',
    preset: (value) => ['portrait', 'landscape', 'macro', 'night'].includes(value)
  }
};



export {
  getTenantByEmail,
  emailExistsInTenants,
  initializeUserSettings,
  settingsValidation
};