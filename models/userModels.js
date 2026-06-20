const db = require('../config/database');
const createUser = (name, role) =>
db.prepare('INSERT INTO users (name, role) VALUES (?,?)').run(name, role);
const deleteUser = (id) =>
db.prepare('DELETE FROM users WHERE id = ?').run(id);
const getAllUsers = () =>
db.prepare('SELECT * FROM users').all();
module.exports = { createUser, deleteUser, getAllUsers };