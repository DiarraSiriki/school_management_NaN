const db = require('../config/database');
const createStudent = (matricule, nom, prenom, age, classe) =>
    db.prepare(
        'INSERT INTO students (matricule,nom,prenom,age,classe) VALUES (?,?,?,?,?)'
    ).run(matricule, nom, prenom, age, classe);

const updateStudent = (id, nom, prenom, age, classe) =>
    db.prepare(
        'UPDATE students SET nom=?,prenom=?,age=?,classe=? WHERE id=?'
    ).run(nom, prenom, age, classe, id);

const deleteStudent = (id) =>
    db.prepare('DELETE FROM students WHERE id=?').run(id);

const findStudent = (search) =>
    db.prepare(
        'SELECT * FROM students WHERE nom LIKE ? OR matricule LIKE ?'
    ).all(`%${search}%`, `%${search}%`);
const getAllStudents = () =>
    db.prepare('SELECT * FROM students ORDER BY nom').all();


module.exports = {
    createStudent, updateStudent, deleteStudent, findStudent, getAllStudents
};