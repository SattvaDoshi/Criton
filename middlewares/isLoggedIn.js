import jwt from 'jsonwebtoken';

// Middleware to verify if the user is logged in
export const isLoggedIn = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // Extract the token from 'Bearer <token>'
    req.user = decoded; // Attach decoded user data (e.g., userId, email, tenantId) to the request
    next();
  } catch (error) {
    console.error('Invalid token:', error);
    return res.status(400).json({ message: 'Invalid token' });
  }
};
