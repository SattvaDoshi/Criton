import { Tenant } from "../models/tenant.model.js";
import { getUserModel } from "../models/user.model.js";
import { connectToTenantDB } from "../config/dbConnection.js";

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
  try {
    // Search for the tenant in the main tenant database using the email    
    const tenant = await Tenant.findOne({ email });
    return tenant;
  } catch (error) {
    // Handle any database errors
    console.error('Error finding tenant:', error);
    throw error;
  }
};


const sanitizeUserData = (user) => {
  if (!user) return null;
  
  const sanitizedUser = { ...user };
  
  // Remove sensitive fields
  delete sanitizedUser.password;
  delete sanitizedUser.__v;
  delete sanitizedUser.refreshToken;
  delete sanitizedUser.passwordResetToken;
  delete sanitizedUser.passwordResetExpires;
  
  return sanitizedUser;
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

const validatePassword = (password) => {
  return password.length >= 8;
}




export {
  getTenantByEmail,
  emailExistsInTenants,
  sanitizeUserData,
  validateEmail,
  validatePassword
};