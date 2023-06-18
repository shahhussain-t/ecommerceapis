const jwt = require('jsonwebtoken');

const jwtAuthorization = {
  sign(payload) {
    const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY);
    return token;
  },
  verify(payload) {
    const token = jwt.verify(payload, process.env.JWT_PRIVATE_KEY);
    return token;
  },

  verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[0];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      console.log(req.userId)
      req.userId = decoded.userId;
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  },
};

module.exports = jwtAuthorization;
