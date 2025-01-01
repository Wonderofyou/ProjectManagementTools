const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

router.post('/edit-profile', userController.editProfile);

router.post("/invite", userController.sendInvite);
router.get("/invitations", userController.getInvitations);
router.post("/response-invitation", userController.responseInvite);


module.exports = router;
