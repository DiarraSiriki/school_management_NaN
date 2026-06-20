import { createTeacher, updateTeacher, deleteTeacher, findTeacher, getAllTeachers } from '../models/teacherModel.js';
import logger from '../utils/logger.js';

// Fonctions utilitaires de tet

function validerChamps(nom, matiere) {
  if (!nom    || nom.trim()    === '') return 'Le nom ne peut pas être vide.';
  if (!matiere || matiere.trim() === '') return 'La matière ne peut pas être vide.';
  return null;
}

//  teacherService

const teacherService = {

  addTeacher(nom, matiere) {
    const erreur = validerChamps(nom, matiere);
    if (erreur) {
      logger.warning(`Ajout professeur échoué : ${erreur}`);
      return { success: false, message: erreur };
    }

    const result = createTeacher(nom.trim(), matiere.trim());
    logger.info(`Professeur ajouté : ${nom} — ${matiere}`);
    return { success: true, message: 'Professeur ajouté avec succès.', id: result.lastInsertRowid };
  },

  editTeacher(id, nom, matiere) {
    if (!id || isNaN(id))
      return { success: false, message: 'ID invalide.' };

    const trouve = findTeacher(String(id));
    if (!trouve || trouve.length === 0) {
      logger.warning(`Modification échouée : professeur ID ${id} introuvable`);
      return { success: false, message: `Aucun professeur trouvé avec l'ID ${id}.` };
    }

    const erreur = validerChamps(nom, matiere);
    if (erreur) {
      logger.warning(`Modification professeur échouée : ${erreur}`);
      return { success: false, message: erreur };
    }

    updateTeacher(id, nom.trim(), matiere.trim());
    logger.info(`Professeur modifié : ID ${id} — ${nom}`);
    return { success: true, message: 'Professeur modifié avec succès.' };
  },

  removeTeacher(id) {
    if (!id || isNaN(id))
      return { success: false, message: 'ID invalide.' };

    const trouve = findTeacher(String(id));
    if (!trouve || trouve.length === 0) {
      logger.warning(`Suppression échouée : professeur ID ${id} introuvable`);
      return { success: false, message: `Aucun professeur trouvé avec l'ID ${id}.` };
    }

    //  Vérification matières liées — à compléter quand subjectModel sera disponible
    const matieres = getSubjectsByTeacher(id);
    if (matieres.length > 0) {
      logger.warning(`Suppression échouée : professeur ID ${id} a ${matieres.length} matière(s) liée(s)`);
      return { success: false, message: 'Impossible de supprimer : ce professeur a des matières liées.' };
    }

    deleteTeacher(id);
    logger.info(`Professeur supprimé : ID ${id}`);
    return { success: true, message: 'Professeur supprimé avec succès.' };
  },

  searchTeacher(query) {
    if (!query || query.trim() === '')
      return { success: false, message: 'Veuillez entrer un terme de recherche.' };

    const results = findTeacher(query.trim());
    logger.info(`Recherche "${query}" : ${results.length} résultat(s)`);
    return { success: true, data: results };
  },

  listTeachers() {
    const teachers = getAllTeachers();
    logger.info(`Liste professeurs : ${teachers.length} trouvé(s)`);
    return { success: true, data: teachers };
  },

};

export default teacherService;