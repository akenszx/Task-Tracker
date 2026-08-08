const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { listTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');

router.use(requireAuth);
router.get('/', listTasks);
router.get('/:id', getTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
