import jwt from 'jsonwebtoken';

const JWT_SECRET = 'some-secret-key';

const isAdmin = (req, res, next) => {
  const token = req.headers['authorization'];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Not authorized' });
      } else {
        req.admin = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({ message: 'Not authorized' });
  }
};

export default isAdmin;
