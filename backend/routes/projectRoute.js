const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');

router.post('/create-project', projectsController.createProject);
router.get('/get-projects', projectsController.getProjects);
router.get('/get-project/:projectId', projectsController.getProject);
router.delete('/delete-project/:projectId', projectsController.deleteProject);


module.exports = router;
