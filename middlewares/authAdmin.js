import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'; // Use environment variables for secrets

const authenticateAdmin = (req, res, next) => { // Middleware to authenticate admin
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token required for authentication' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from Authorization header

  jwt.verify(token, JWT_SECRET, (err, decoded) => { // Verify token
    if (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' }); // Invalid token
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized, admin access required' }); // Not an admin
    }

    req.adminId = decoded.id; // Store admin ID in request for further use
    next();
  });
}

export default authenticateAdmin;
