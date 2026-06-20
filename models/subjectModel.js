// models/subjectModel.js
const db = require('../config/database');
const createSubject = (nom) =>
db.prepare('INSERT INTO subjects (nom) VALUES (?)').run(nom);
const assignTeacher = (subjectId, teacherId) =>
db.prepare('UPDATE subjects SET teacher_id=? WHERE id=?').run(teacherId, subjectId);
const getAllSubjects = () =>
db.prepare(`
SELECT s.id, s.nom, t.nom AS professeur
FROM subjects s
LEFT JOIN teachers t ON s.teacher_id = t.id
`).all();
module.exports = { createSubject, assignTeacher, getAllSubjects };