const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

const auth = require('../auth');

router.post('/signup', usersController.signUp);
router.post('/signin', usersController.signIn);
router.get('/page/:pageNumber', auth, usersController.fetchByPageNumber);

module.exports = router;