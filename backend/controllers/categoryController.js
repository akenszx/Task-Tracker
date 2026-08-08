const { Category } = require('../models');

// GET /api/categories
async function listCategories(req, res) {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return res.json({ categories });
  } catch (err) {
    console.error('listCategories error:', err);
    return res.status(500).json({ error: 'Something went wrong fetching categories' });
  }
}

// POST /api/categories
async function createCategory(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }

    const existing = await Category.findOne({ where: { name: name.trim() } });
    if (existing) {
      return res.status(409).json({ error: 'A category with this name already exists' });
    }

    const category = await Category.create({ name: name.trim() });
    return res.status(201).json({ category });
  } catch (err) {
    console.error('createCategory error:', err);
    return res.status(500).json({ error: 'Something went wrong creating the category' });
  }
}

module.exports = { listCategories, createCategory };