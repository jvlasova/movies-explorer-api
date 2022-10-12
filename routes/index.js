const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');
const { validateLogin, validateUser } = require('../validation/validation');
const { login, createUser, signOut } = require('../controllers/users');
const { currentError } = require('../utils/errors');

router.post('/signup', express.json(), validateUser, createUser);
router.post('/signin', express.json(), validateLogin, login);

router.use(auth);

router.use('/signout', signOut);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((req, res, next) => {
  next(currentError({ name: 'NotFoundError' }));
});

module.exports = router;
