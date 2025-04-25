const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied.');

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};
