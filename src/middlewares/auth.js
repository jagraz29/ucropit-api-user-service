let jwt = require('jsonwebtoken');
const User = require('../models').users

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;

        const user = await User.findOne({ where: { id: decoded.user.id } })
        
        if (user === null) {
          return res.status(401).json({
            success: false,
            message: 'Auth token is not supplied'
          })
        }

        next();
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

let checkTokenDashboard = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_DASHBOARD, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;

        const user = await User.findOne({ where: { id: decoded.user.id } })
        
        if (user === null) {
          return res.status(401).json({
            success: false,
            message: 'Auth token is not supplied'
          })
        }

        next();
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
}

module.exports = {
  checkToken: checkToken,
  checkTokenDashboard: checkTokenDashboard
}