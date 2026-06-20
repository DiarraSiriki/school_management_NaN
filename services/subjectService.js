import { createSubject, assignTeacher, getAllSubjects } from '../models/subjectModel.js';
import { findTeacher } from '../models/teacherModel.js';
import logger from '../utils/logger.js';

// ─── Service ─────────────────────────────────────────────────────────────────

const subjectService = {

  addSubject(nom) {
    if (!nom || nom.trim() === '') {
      logger.warning('Ajout matière échoué : nom vide');
      return { success: false, message: 'Le nom de la matière ne peut pas être vide.' };
    }

    // Vérifier unicité
    const toutes = getAllSubjects();
    const existe = toutes.find(s => s.nom.toLowerCase() === nom.trim().toLowerCase());
    if (existe) {
      logger.warning(`Ajout matière échoué : "${nom}" existe déjà`);
      return { success: false, message: `La matière "${nom}" existe déjà.` };
    }

    const result = createSubject(nom.trim());
    logger.info(`Matière ajoutée : ${nom}`);
    return { success: true, message: 'Matière ajoutée avec succès.', id: result.lastInsertRowid };
  },

  linkTeacher(subjectId, teacherId) {
    if (!subjectId || isNaN(subjectId))
      return { success: false, message: 'ID matière invalide.' };
    if (!teacherId || isNaN(teacherId))
      return { success: false, message: 'ID professeur invalide.' };

    // Vérifier que la matière existe
    const toutes    = getAllSubjects();
    const matiere   = toutes.find(s => s.id === Number(subjectId));
    if (!matiere) {
      logger.warning(`Liaison échouée : matière ID ${subjectId} introuvable`);
      return { success: false, message: `Aucune matière trouvée avec l'ID ${subjectId}.` };
    }

    // Vérifier que le professeur existe
    const profs = findTeacher(String(teacherId));
    if (!profs || profs.length === 0) {
      logger.warning(`Liaison échouée : professeur ID ${teacherId} introuvable`);
      return { success: false, message: `Aucun professeur trouvé avec l'ID ${teacherId}.` };
    }

    assignTeacher(subjectId, teacherId);
    logger.info(`Matière ID ${subjectId} liée au professeur ID ${teacherId}`);
    return { success: true, message: `Matière "${matiere.nom}" liée au professeur "${profs[0].nom}".` };
  },

  listSubjects() {
    const subjects = getAllSubjects();
    logger.info(`Liste matières : ${subjects.length} trouvée(s)`);
    return { success: true, data: subjects };
  },

};

export default subjectService;