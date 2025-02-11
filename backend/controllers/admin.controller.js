import { Tenant } from "../models/tenant.model.js";

const verifyTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const tenant = await Tenant.findOneAndUpdate(
      { tenantId },
      { isVerified: true },
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.status(200).json({ 
      message: 'Tenant verified successfully', 
      tenant 
    });
  } catch (error) {
    console.error('Verify tenant failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const listUnverifiedTenants = async (req, res) => {
  try {
    const unverifiedTenants = await Tenant.find({ isVerified: false });
    res.status(200).json({ 
      message: 'Unverified tenants retrieved', 
      unverifiedTenants 
    });
  } catch (error) {
    console.error('List unverified tenants failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const listAllUsers = async (req, res) => {
  try {
    // Get all verified tenants
    const verifiedTenants = await Tenant.find();

    res.status(200).json({ 
      message: 'All users retrieved', 
      users: verifiedTenants 
    });
  } catch (error) {
    console.error('List all users failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Optionally, delete corresponding tenant entry
    await Tenant.findOneAndDelete({ tenantId });

    res.status(200).json({ 
      message: 'User deleted successfully', 
    });
  } catch (error) {
    console.error('Delete user failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  verifyTenant,
  listUnverifiedTenants,
  listAllUsers,
  deleteUser
};