const rateLimit = require('express-rate-limit');
const { messageLimiter } = require('./constant');

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: messageLimiter,
});
