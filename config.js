require('dotenv').config();

module.exports = {
  PORT: 3000,
  MONGO_URI: 'mongodb://localhost:27017/moviesdb',
  DB_ADDRESS: (process.env.NODE_ENV !== 'production') ? 'MONGO_URI' : process.env.DB_ADDRESS,
  JWT_SECRET: (process.env.NODE_ENV !== 'production') ? 'JWT_SECRET' : process.env.JWT_SECRET,
};
