const db = require('../config/database');


const createTeacher = (nom, matiere) =>
    db.prepare('INSERT INTO teachers (nom,matiere) VALUES (?,?)').run(nom, matiere);

const updateTeacher = (id, nom, matiere) =>
    db.prepare('UPDATE teachers SET nom=?,matiere=? WHERE id=?').run(nom, matiere, id);

const deleteTeacher = (id) =>
    db.prepare('DELETE FROM teachers WHERE id=?').run(id);

const findTeacher = (search) =>
    db.prepare('SELECT * FROM teachers WHERE nom LIKE ?').all(`%${search}%`);

const getAllTeachers = () =>
   db.prepare('SELECT * FROM teachers ORDER BY nom').all();



module.exports = {
    createTeacher, updateTeacher, deleteTeacher, findTeacher, getAllTeachers
};
