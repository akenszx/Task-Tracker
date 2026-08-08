const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Task = require('./Task');

// One User has many Tasks
User.hasMany(Task, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'user_id' });

// One Category has many Tasks
Category.hasMany(Task, { foreignKey: 'category_id', onDelete: 'RESTRICT' });
Task.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = { sequelize, User, Category, Task };