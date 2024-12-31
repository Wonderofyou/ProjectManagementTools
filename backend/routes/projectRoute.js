const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');

router.post('/create-project', projectsController.createProject);

// Route này mời user vào dự án với userid là tham số
router.post("/invite", projectsController.sendInvite);


module.exports = router;
