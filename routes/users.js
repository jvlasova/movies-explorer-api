const express = require('express');
const { validateUserUpdate } = require('../validation/validation');

const users = express.Router();

const {
  getMe,
  updateUserInfo,
} = require('../controllers/users');

users.get('/me', express.json(), getMe);

users.patch('/me', express.json(), validateUserUpdate, updateUserInfo);

module.exports = users;
