const db = require('../config/database');
const addGrade = (studentId, subjectId, note) =>
db.prepare(
'INSERT INTO grades (student_id,subject_id,note) VALUES (?,?,?)'
).run(studentId, subjectId, note);
const updateGrade = (id, note) =>
db.prepare('UPDATE grades SET note=? WHERE id=?').run(note, id);
const deleteGrade = (id) =>
db.prepare('DELETE FROM grades WHERE id=?').run(id);
const getGradesByStudent = (studentId) =>
db.prepare(`
SELECT g.id, s.nom AS matiere, g.note
FROM grades g
JOIN subjects s ON g.subject_id = s.id
WHERE g.student_id = ?
`).all(studentId);
const getAverageByStudent = (studentId) =>
db.prepare(
'SELECT AVG(note) AS moyenne FROM grades WHERE student_id=?'
).get(studentId);
module.exports = {
addGrade, updateGrade, deleteGrade, getGradesByStudent, getAverageByStudent
};
