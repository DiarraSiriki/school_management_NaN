import db from '../config/database.js';

// ─── Écriture ────────────────────────────────────────────────────────────────

export const createUser = (name, role, email, password) =>
  db.prepare(
    'INSERT INTO users (name, role, email, password) VALUES (?, ?, ?, ?)'
  ).run(name, role, email, password);

export const updateUser = (id, name, role, email) =>
  db.prepare(
    'UPDATE users SET name=?, role=?, email=? WHERE id=?'
  ).run(name, role, email, id);

export const deleteUser = (id) =>
  db.prepare('DELETE FROM users WHERE id=?').run(id);

// ─── Lecture ─────────────────────────────────────────────────────────────────

export const getAllUsers = () =>
  db.prepare('SELECT id, name, role, email FROM users ORDER BY name').all();

export const getUserById = (id) =>
  db.prepare('SELECT id, name, role, email FROM users WHERE id=?').get(id);

export const getUserByEmail = (email) =>
  db.prepare('SELECT * FROM users WHERE email=?').get(email);