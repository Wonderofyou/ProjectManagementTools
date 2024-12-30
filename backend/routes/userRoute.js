const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

router.post('/edit-profile', userController.editProfile);

module.exports = router;
