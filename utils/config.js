require('dotenv').config();

module.exports = {
  PORT: process.env.NODE_ENV !== 'production' ? 3000 : process.env.PORT,
  MONGO_URI: process.env.NODE_ENV !== 'production' ? 'mongodb://localhost:27017/moviesdb' : process.env.MONGO_URI,
  JWT_SECRET: process.env.NODE_ENV !== 'production' ? 'JWT_SECRET' : process.env.JWT_SECRET,
};
