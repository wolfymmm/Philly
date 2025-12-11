import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey123';

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    req.user = decoded; 
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;