import { addGrade, updateGrade, deleteGrade, getGradesByStudent, getAverageByStudent } from '../models/gradeModel.js';
import { getAllStudents } from '../models/studentModel.js';
import { getAllSubjects } from '../models/subjectModel.js';
import logger from '../utils/logger.js';

// ─── Fonctions utilitaires ───────────────────────────────────────────────────

function validerNote(note) {
  if (note === undefined || note === null || note === '')
    return 'La note ne peut pas être vide.';
  if (isNaN(note) || Number(note) < 0 || Number(note) > 20)
    return 'La note doit être un nombre entre 0 et 20.';
  return null;
}

function etudiantExiste(studentId) {
  const etudiants = getAllStudents();
  return etudiants.find(e => e.id === Number(studentId));
}

function matiereExiste(subjectId) {
  const matieres = getAllSubjects();
  return matieres.find(s => s.id === Number(subjectId));
}

// ─── Service ─────────────────────────────────────────────────────────────────

const gradeService = {

  addGrade(studentId, subjectId, note) {
    if (!studentId || isNaN(studentId))
      return { success: false, message: 'ID étudiant invalide.' };
    if (!subjectId || isNaN(subjectId))
      return { success: false, message: 'ID matière invalide.' };

    // Vérifier existence étudiant
    const etudiant = etudiantExiste(studentId);
    if (!etudiant) {
      logger.warning(`Ajout note échoué : étudiant ID ${studentId} introuvable`);
      return { success: false, message: `Aucun étudiant trouvé avec l'ID ${studentId}.` };
    }

    // Vérifier existence matière
    const matiere = matiereExiste(subjectId);
    if (!matiere) {
      logger.warning(`Ajout note échoué : matière ID ${subjectId} introuvable`);
      return { success: false, message: `Aucune matière trouvée avec l'ID ${subjectId}.` };
    }

    // Valider la note
    const erreur = validerNote(note);
    if (erreur) {
      logger.warning(`Ajout note échoué : ${erreur}`);
      return { success: false, message: erreur };
    }

    const result = addGrade(studentId, subjectId, Number(note));
    logger.info(`Note ajoutée : étudiant ID ${studentId} — ${matiere.nom} — ${note}/20`);
    return { success: true, message: 'Note ajoutée avec succès.', id: result.lastInsertRowid };
  },

  editGrade(id, note) {
    if (!id || isNaN(id))
      return { success: false, message: 'ID note invalide.' };

    const erreur = validerNote(note);
    if (erreur) {
      logger.warning(`Modification note échouée : ${erreur}`);
      return { success: false, message: erreur };
    }

    const result = updateGrade(id, Number(note));
    if (result.changes === 0) {
      logger.warning(`Modification échouée : note ID ${id} introuvable`);
      return { success: false, message: `Aucune note trouvée avec l'ID ${id}.` };
    }

    logger.info(`Note modifiée : ID ${id} — ${note}/20`);
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
      return { success: false, message: `Aucun étudiant trouvé avec l'ID ${studentId}.` };
    }

    const result  = getAverageByStudent(studentId);
    const moyenne = result?.moyenne ? Number(result.moyenne).toFixed(2) : '0.00';

    logger.info(`Moyenne étudiant ID ${studentId} : ${moyenne}/20`);
    return { success: true, moyenne, etudiant: etudiant.nom };
  },

};

export default gradeService;