// Import required modules and models
import { Tenant } from "../models/tenant.model.js";
import { connectToTenantDB } from "../config/dbConnection.js";
import { getUserModel } from "../models/user.model.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { emailExistsInTenants, getTenantByEmail } from "../utils/helper.js";
import jwt from 'jsonwebtoken';

// Define cookie options for secure token storage
const COOKIE_OPTIONS = {
  httpOnly: true, // Prevent client-side access to cookies
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax', // Strict in production, Lax in development
  maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 24 hours
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? '.critontech.com' : 'localhost' // Domain-specific cookies
};

// Controller for registering a new tenant
const registerTenant = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    } else {
      // Check if the email already exists across tenants
      const emailExists = await emailExistsInTenants(email);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Generate a unique tenant ID and connect to tenant-specific database
      const tenantId = uuidv4().substring(0, 20);
      const tenantConnection = await connectToTenantDB(tenantId);
      const User = getUserModel(tenantConnection);

      // Hash the password and save the user in the tenant database
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      const savedUser = await newUser.save();

      // Save tenant information in the main database
      const dbName = `tenant_${tenantId}`;
      const dbUri = `${process.env.MONGO_URI}${dbName}${process.env.MONGO_URI_2}`;
      const newTenant = new Tenant({ tenantId, dbUri, email });
      await newTenant.save();

      // Respond with success message
      res.status(201).json({ message: 'Tenant registered successfully', tenantId, userId: savedUser._id });
    }
  } catch (error) {
    console.error('Failed to register tenant:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller for tenant login
const loginTenant = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve tenant by email
    const tenant = await getTenantByEmail(email);
    if (!tenant) {
      return res.status(404).json({ message: 'No tenant found with this email' });
    }

    // Check if tenant is verified
    if (!tenant.isVerified) {
      return res.status(403).json({ 
        message: 'Tenant account is pending verification. Please contact administrator.' 
      });
    }

    // Connect to tenant-specific database
    const { tenantId } = tenant;
    const tenantConnection = await connectToTenantDB(tenantId);
    const User = getUserModel(tenantConnection);

    // Find the user by email and validate the password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT and set it in a secure cookie
    const token = jwt.sign({ userId: user._id, tenantId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    res.cookie('token', token, COOKIE_OPTIONS);

    // Respond with success message
    res.status(200).json({ message: 'Login successful', tenantId, user, token });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller for tenant logout
const logoutTenant = (req, res) => {
  // Clear the authentication token cookie
  res.clearCookie('token', COOKIE_OPTIONS);
  res.status(200).json({ message: 'Logout successful' });
};

// Controller for retrieving tenant data
const getTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Verify authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Connect to tenant-specific database
    const tenantConnection = await connectToTenantDB(tenantId);
    const User = getUserModel(tenantConnection);

    // Retrieve user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Tenant data retrieved successfully', user });
  } catch (error) {
    console.error('Get tenant failed:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller for updating user details
const addUserDetails = async (req, res) => {
  try {
    const { companyName, companySize, companyAddress, companyGST, number } = req.body;
    const { tenantId, userId } = req.params;

    // Connect to tenant-specific database
    const tenantConnection = await connectToTenantDB(tenantId);
    const User = getUserModel(tenantConnection);

    // Find user and update details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.companyName = companyName;
    user.companySize = companySize;
    user.companyAddress = companyAddress;
    user.companyGST = companyGST;
    user.number = number;
    await user.save();

    res.status(200).json({ message: 'User details updated successfully', user });
  } catch (error) {
    console.error('Update user details failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export controllers for use in routes
export {
  registerTenant,
  loginTenant,
  logoutTenant,
  getTenant,
  addUserDetails
};
