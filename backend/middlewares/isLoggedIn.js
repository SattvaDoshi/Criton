import jwt from 'jsonwebtoken';
import { Tenant } from '../models/tenant.model.js';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    // console.log("Request Cookies:", req.cookies);
    // console.log("Request Headers:", req.headers);
    // console.log("Extracted Token:", token);

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token Payload:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    // console.error("JWT Error:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    // Get token from request
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);    
    
    // Find tenant by ID
    const tenant = await Tenant.findOne({ 
      tenantId: decoded.tenantId,
    });

    if (!tenant) {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    res.status(401).json({ 
      message: 'Unauthorized. Invalid or missing admin token.' 
    });
  }
};

export { isAdmin };
