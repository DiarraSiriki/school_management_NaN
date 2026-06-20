const db = require('../config/database');
function initDatabase() {
db.exec(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
mot_de_passe TEXT NOT NULL,
role TEXT NOT NULL CHECK(role IN ('admin','professeur','étudiant'))
);
CREATE TABLE IF NOT EXISTS students (
id INTEGER PRIMARY KEY AUTOINCREMENT,
matricule TEXT UNIQUE NOT NULL,
nom TEXT NOT NULL,
prenom TEXT NOT NULL,
age INTEGER NOT NULL,
classe TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS teachers (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nom TEXT NOT NULL,
matiere TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS subjects (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nom TEXT NOT NULL,
teacher_id INTEGER,
FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);
CREATE TABLE IF NOT EXISTS grades (
id INTEGER PRIMARY KEY AUTOINCREMENT,
student_id INTEGER NOT NULL,
subject_id INTEGER NOT NULL,
note REAL NOT NULL CHECK(note >= 0 AND note <= 20),
FOREIGN KEY (student_id) REFERENCES students(id),
FOREIGN KEY (subject_id) REFERENCES subjects(id)
);
CREATE TABLE IF NOT EXISTS absences (
id INTEGER PRIMARY KEY AUTOINCREMENT,
student_id INTEGER NOT NULL,
date TEXT NOT NULL,
status TEXT NOT NULL DEFAULT 'non justifiée'
CHECK(status IN ('justifiée','non justifiée')),
FOREIGN KEY (student_id) REFERENCES students(id)
);
`);
}
module.exports = { initDatabase };