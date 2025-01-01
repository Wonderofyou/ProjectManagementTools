const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

router.post('/create-task', tasksController.createTask);
router.get('/get-tasks', tasksController.getTasks);

module.exports = router;
