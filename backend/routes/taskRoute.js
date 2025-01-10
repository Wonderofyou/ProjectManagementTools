const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

router.post('/create-task/:project_id', tasksController.createTask);
router.get('/get-tasks/:project_id', tasksController.getTasks);

router.get('/get-user-info/:project_id', tasksController.getUserInfo);
router.get('/get-project-info/:project_id', tasksController.getProjectInfo);

router.get('/get-tasks-for-report/:project_id', tasksController.getTasksForReport);
router.get('/get-members-in-project/:project_id', tasksController.getMembersInProject);
router.put('/update-status/:task_id', tasksController.updateTaskStatus);
router.delete('/delete-task/:task_id', tasksController.deleteTask);
module.exports = router;
