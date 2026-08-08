const { Op } = require('sequelize');
const { Task, Category } = require('../models');

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];

// GET /api/tasks?status=&category_id=&search=&page=&limit=&sort=
async function listTasks(req, res) {
  try {
    const { status, category_id, search, sort } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const offset = (page - 1) * limit;

    const where = { user_id: req.user.id };

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
      }
      where.status = status;
    }

    if (category_id) {
      where.category_id = category_id;
    }

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    // Sorting: defaults to newest-first. ?sort=due_date or ?sort=status
    // switches to that field, ascending.
    const SORTABLE_FIELDS = { due_date: 'due_date', status: 'status' };
    let order = [['created_at', 'DESC']];
    if (sort && SORTABLE_FIELDS[sort]) {
      order = [[SORTABLE_FIELDS[sort], 'ASC']];
    }

    const { count, rows } = await Task.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ['id', 'name'] }],
      order,
      limit,
      offset,
    });

    return res.json({
      tasks: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error('listTasks error:', err);
    return res.status(500).json({ error: 'Something went wrong fetching tasks' });
  }
}

// GET /api/tasks/:id
async function getTask(req, res) {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{ model: Category, attributes: ['id', 'name'] }],
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.json({ task });
  } catch (err) {
    console.error('getTask error:', err);
    return res.status(500).json({ error: 'Something went wrong fetching the task' });
  }
}

// POST /api/tasks
async function createTask(req, res) {
  try {
    const { title, description, status, due_date, category_id } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }
    if (!category_id) {
      return res.status(400).json({ error: 'category_id is required' });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({ error: 'category_id does not reference an existing category' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || null,
      status: status || 'pending',
      due_date: due_date || null,
      category_id,
      user_id: req.user.id,
    });

    return res.status(201).json({ task });
  } catch (err) {
    console.error('createTask error:', err);
    return res.status(500).json({ error: 'Something went wrong creating the task' });
  }
}

// PUT /api/tasks/:id
async function updateTask(req, res) {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, status, due_date, category_id } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ error: 'category_id does not reference an existing category' });
      }
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (due_date !== undefined) task.due_date = due_date;
    if (category_id !== undefined) task.category_id = category_id;

    await task.save();
    return res.json({ task });
  } catch (err) {
    console.error('updateTask error:', err);
    return res.status(500).json({ error: 'Something went wrong updating the task' });
  }
}

// DELETE /api/tasks/:id
async function deleteTask(req, res) {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error('deleteTask error:', err);
    return res.status(500).json({ error: 'Something went wrong deleting the task' });
  }
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
