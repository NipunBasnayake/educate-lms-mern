const jwt = require('jsonwebtoken');
const {UNAUTHORIZED,FORBIDDEN} = require("../config/statusCode");

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.error('No token, authorization denied',UNAUTHORIZED);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.error('Access denied',FORBIDDEN);
      }
      next();
    } catch (error) {
      res.error('Invalid token',UNAUTHORIZED,error);
    }
  };
};

module.exports = authMiddleware;