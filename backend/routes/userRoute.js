const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

router.post('/edit-profile', userController.editProfile);

router.post("/invite", userController.sendInvite);
router.get("/invitations", userController.getInvitations);
router.post("/response-invitation", userController.responseInvite);
router.get("/notifications", userController.getNotifications);
router.post('/update-status/:notificationId', userController.updateNotificationStatus);
router.delete('/delete-notification/:notificationId', userController.deleteNotification);



module.exports = router;
