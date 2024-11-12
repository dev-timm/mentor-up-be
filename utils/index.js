const { createJWT, isTokenValide, attachCookiesToResponse } = require('./jwt');

module.exports = {
  createJWT,
  isTokenValide,
  attachCookiesToResponse,
};
