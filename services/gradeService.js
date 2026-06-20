import { addGrade, updateGrade, deleteGrade, getGradesByStudent, getAverageByStudent } from '../models/gradeModel.js';
import { getAllStudents } from '../models/studentModel.js';
import { getAllSubjects } from '../models/subjectModel.js';
import logger from '../utils/logger.js';

// Fonctions utilitaires 

function validerNote(note) {
  const n = parseFloat(note);
  if (isNaN(n) || n < 0 || n > 20)
    return { erreur: 'La note doit être entre 0 et 20.', note: null };
  return { erreur: null, note: n };
}

function etudiantExiste(studentId) {
  return getAllStudents().find(e => e.id === Number(studentId));
}

function matiereExiste(subjectId) {
  return getAllSubjects().find(s => s.id === Number(subjectId));
}

// gradeService 

const gradeService = {

  addGrade(studentId, subjectId, note) {
    if (!studentId || isNaN(studentId))
      return { success: false, message: 'ID étudiant invalide.' };
    if (!subjectId || isNaN(subjectId))
      return { success: false, message: 'ID matière invalide.' };

    const etudiant = etudiantExiste(studentId);
    if (!etudiant) {
      logger.warning(`Ajout note échoué : étudiant ID ${studentId} introuvable`);
      return { success: false, message: `Aucun étudiant trouvé avec l'ID ${studentId}.` };
    }

    const matiere = matiereExiste(subjectId);
    if (!matiere) {
      logger.warning(`Ajout note échoué : matière ID ${subjectId} introuvable`);
      return { success: false, message: `Aucune matière trouvée avec l'ID ${subjectId}.` };
    }

    const { erreur, note: n } = validerNote(note);
    if (erreur) {
      logger.warning(`Note invalide rejetée : ${note}`);
      return { success: false, message: erreur };
    }

    const result = addGrade(studentId, subjectId, n);
    logger.info(`Note ${n}/20 ajoutée — étudiant ID ${studentId} — ${matiere.nom}`);
    return { success: true, message: 'Note ajoutée avec succès.', id: result.lastInsertRowid };
  },

  editGrade(id, note) {
    if (!id || isNaN(id))
      return { success: false, message: 'ID note invalide.' };

    const { erreur, note: n } = validerNote(note);
    if (erreur) {
      logger.warning(`Modification note échouée : ${erreur}`);
      return { success: false, message: erreur };
    }

    const result = updateGrade(id, n);
    if (result.changes === 0) {
      logger.warning(`Modification échouée : note ID ${id} introuvable`);
      return { success: false, message: `Aucune note trouvée avec l'ID ${id}.` };
    }

    logger.info(`Note modifiée : ID ${id} — ${n}/20`);
    return { success: true, message: 'Note modifiée avec succès.' };
  },

  removeGrade(id) {
    if (!id || isNaN(id))
      return { success: false, message: 'ID note invalide.' };

    const result = deleteGrade(id);
    if (result.changes === 0) {
      logger.warning(`Suppression échouée : note ID ${id} introuvable`);
      return { success: false, message: `Aucune note trouvée avec l'ID ${id}.` };
    }

    logger.info(`Note supprimée : ID ${id}`);
    return { success: true, message: 'Note supprimée avec succès.' };
  },

  getStudentGrades(studentId) {
    if (!studentId || isNaN(studentId))
      return { success: false, message: 'ID étudiant invalide.' };

    const etudiant = etudiantExiste(studentId);
    if (!etudiant) {
      logger.warning(`Notes introuvables : étudiant ID ${studentId} inexistant`);
      return { success: false, message: `Aucun étudiant trouvé avec l'ID ${studentId}.` };
    }

    const grades = getGradesByStudent(studentId);
    logger.info(`Notes étudiant ID ${studentId} : ${grades.length} note(s)`);
    return { success: true, data: grades };
  },

  getStudentAverage(studentId) {
    if (!studentId || isNaN(studentId))
      return { success: false, message: 'ID étudiant invalide.' };

    const etudiant = etudiantExiste(studentId);
    if (!etudiant) {
      logger.warning(`Moyenne introuvable : étudiant ID ${studentId} inexistant`);
      return { success: false, message: `Aucun étudiant trouvé avec l'ID ${studentId}.` };
    }

    const result  = getAverageByStudent(studentId);
    const moyenne = result?.moyenne ? Number(result.moyenne).toFixed(2) : '0.00';

    logger.info(`Moyenne étudiant ID ${studentId} (${etudiant.nom}) : ${moyenne}/20`);
    return { success: true, moyenne, etudiant: etudiant.nom };
  },

};

export default gradeService;