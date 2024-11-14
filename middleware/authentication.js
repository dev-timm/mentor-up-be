const UnauthenticatedError = require('../errors/unauthenticated');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    return next(new UnauthenticatedError('Authentication Invalid'));
  }
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    console.log(error);

    return next(new UnauthenticatedError(error));
  }
};

module.exports = {
  authenticateUser,
};

// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const { UnauthenticatedError } = require('../errors');

// const auth = async (req, res, next) => {
//   // check header
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer')) {
//     return next(new UnauthenticatedError('Authentication invalid'));
//   }
//   const token = authHeader.split(' ')[1];

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     // attach the user to the job routes
//     req.user = { userId: payload.userId, name: payload.name };
//     next();
//   } catch (error) {
//     return next(new UnauthenticatedError('Authentication invalid'));
//   }
// };

// module.exports = auth;
