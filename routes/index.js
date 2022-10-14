const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');
const { validateLogin, validateUser } = require('../middlewares/validation');
const { login, createUser, signOut } = require('../controllers/users');
const NotFoundError = require('../errors/not_found_error');
const { messageNotFoundError } = require('../utils/constant');

router.post('/signup', express.json(), validateUser, createUser);
router.post('/signin', express.json(), validateLogin, login);

router.use(auth);

router.use('/signout', signOut);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((req, res, next) => {
  const err = new NotFoundError(messageNotFoundError);
  next(err);
});

module.exports = router;
