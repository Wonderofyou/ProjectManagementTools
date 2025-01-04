const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

router.post('/create-task/:project_id', tasksController.createTask);
router.get('/get-tasks/:project_id', tasksController.getTasks);
router.get('/get-members-in-project/:project_id', tasksController.getMembersInProject);

module.exports = router;
