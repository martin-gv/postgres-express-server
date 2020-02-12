module.exports = {
  ACCESS: {
    type: 'ACCESS',
    expiry: process.env.JWT_ACCESS_EXPIRY || '1m',
  },
  REFRESH: {
    type: 'REFRESH',
    expiry: process.env.JWT_REFRESH_EXPIRY || '24h',
  },
};
