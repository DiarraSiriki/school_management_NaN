const db = require('../config/database');
const createUser = (name, role, email, password) =>
db.prepare('INSERT INTO users (name, role, email, password) VALUES (?, ?, ?, ?)').run(name, role, email, password);
const deleteUser = (id) =>
db.prepare('DELETE FROM users WHERE id = ?').run(id);
const getAllUsers = () =>
db.prepare('SELECT * FROM users').all();
module.exports = { createUser, deleteUser, getAllUsers };