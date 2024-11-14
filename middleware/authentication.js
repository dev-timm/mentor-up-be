const { UnauthorizedError } = require('../errors');
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

    return next(new UnauthenticatedError('Authentication Invalid'));
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new UnauthorizedError('Unauthorized to access this route'));
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
