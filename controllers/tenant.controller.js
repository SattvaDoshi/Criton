import { Tenant } from "../models/tenant.model.js";
import { connectToTenantDB } from "../config/dbConnection.js";
import { getUserModel } from "../models/user.model.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { emailExistsInTenants, getTenantByEmail, initializeUserSettings } from "../utils/helper.js";
import jwt from 'jsonwebtoken';

const registerTenant = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if email already exists
    const emailExists = await emailExistsInTenants(email);
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists across tenants' });
    }

    // Generate unique tenantId
    const tenantId = uuidv4().substring(0, 20);

    // Create tenant-specific database connection
    const tenantConnection = await connectToTenantDB(tenantId);

    // Get tenant-specific User model
    const User = getUserModel(tenantConnection);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user for the tenant
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    
    const savedUser = await newUser.save()

    await initializeUserSettings(savedUser._id, tenantConnection);


    // Store tenant metadata in the main tenant database
    const dbName = `tenant_${tenantId}`;
    const dbUri = `${process.env.MONGO_URI}${dbName}${process.env.MONGO_URI_2}`;
    const newTenant = new Tenant({
      tenantId,
      dbUri,
      email
    });
    await newTenant.save();

    res.status(201).json({ message: 'Tenant registered successfully', tenantId });
  } catch (error) {
    console.error('Failed to register tenant:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const loginTenant = async (req, res) => {
  const { email, password } = req.body;

  try {

    // Step 1: Find the tenant associated with the email
    const tenant = await getTenantByEmail(email);
    if (!tenant) {
      return res.status(404).json({ message: 'No tenant found with this email' });
    }

    const { tenantId } = tenant;

    // Step 2: Connect to the tenant's specific database
    const tenantConnection = await connectToTenantDB(tenantId);
    const User = getUserModel(tenantConnection);

    // Step 3: Find the user by email in the tenant's database
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 4: Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Step 5: Generate a JWT token (use environment variables for secret and expiry)
    const token = jwt.sign(
      { userId: user._id, tenantId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    // Step 6: Ensure session object exists
    if (!req.session) {
      console.error('Session object is undefined. Middleware may not be configured correctly.');
      return res.status(500).json({
        message: 'Server configuration error',
      });
    }

    // Step 7: Set token and tenantId in session
    req.session.token = token;
    req.session.tenantId = tenantId;

    // Step 8: Save session explicitly to ensure it's stored before sending response
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Error saving session' });
      }

      // Step 9: Respond with a success message
      res.status(200).json({ message: 'Login successful', tenantId, token });
    });

  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const logoutTenant = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }

    res.status(200).json({ message: 'Logout successful' });
  });
};


const getTenant = async (req, res) => {
  try {
    // Step 1: Ensure the user is authenticated
    if (!req.session || !req.session.token || !req.session.tenantId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { tenantId } = req.session;


    // Step 3: Connect to the tenant's specific database
    const tenantConnection = await connectToTenantDB(tenantId);
    const User = getUserModel(tenantConnection);

    // Step 4: Decode the JWT token to get the userId
    const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Step 5: Find the user in the tenant's database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 7: Send the response
    res.status(200).json({
      message: 'Tenant data retrieved successfully',
      user: user
    });

  } catch (error) {
    console.error('Get tenant failed:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addUserDetails = async (req, res) => {
  try {
    const { companyName, companySize, companyAddress, companyGST, number } = req.body;

    // Step 1: Ensure the user is authenticated
    if (!req.session || !req.session.token || !req.session.tenantId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { tenantId } = req.session;

    // Step 3: Connect to the tenant's specific database
    const tenantConnection = await connectToTenantDB(tenantId);
    const User = getUserModel(tenantConnection);

    // Step 4: Decode the JWT token to get the userId
    const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Step 5: Find the user in the tenant's database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 6: Update the user's details
    user.companyName = companyName;
    user.comapnySize = companySize;
    user.comapnyAddress = companyAddress;
    user.companyGST = companyGST;
    user.number = number;
    await user.save();

    // Step 7: Send the response
    res.status(200).json({
      message: 'User details retrieved successfully',
      user: user
    });

  } catch (error) {
    console.error('Get user details failed:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  registerTenant,
  loginTenant,
  logoutTenant,
  getTenant,
  addUserDetails
};
