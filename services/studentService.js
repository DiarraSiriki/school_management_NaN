import { createStudent, updateStudent, deleteStudent, findStudent, getAllStudents } from '../models/studentModel.js';
import logger from '../utils/logger.js';

// ─── Fonctions utilitaires ───────────────────────────────────────────────────

function generateMatricule() {
  const year = new Date().getFullYear();
  const all  = getAllStudents();
  const seq  = String(all.length + 1).padStart(4, '0');
  return `ETU-${year}-${seq}`;
}

function validerChamps(nom, prenom, age) {
  if (!nom    || nom.trim()    === '') return 'Le nom ne peut pas être vide.';
  if (!prenom || prenom.trim() === '') return 'Le prénom ne peut pas être vide.';
  if (!age    || isNaN(age) || Number(age) < 5 || Number(age) > 30)
    return "L'âge doit être entre 5 et 30.";
  return null;
}

// ─── Service ─────────────────────────────────────────────────────────────────

const studentService = {

  addStudent(nom, prenom, age, classe) {
    const erreur = validerChamps(nom, prenom, age);
    if (erreur) {
      logger.warning(`Ajout étudiant échoué : ${erreur}`);
      return { success: false, message: erreur };
    }

    const matricule = generateMatricule();
    const result    = createStudent(matricule, nom.trim(), prenom.trim(), Number(age), classe);

    logger.info(`Étudiant ajouté : ${prenom} ${nom} — ${matricule}`);
    return { success: true, message: 'Étudiant ajouté avec succès.', matricule, id: result.lastInsertRowid };
  },

  editStudent(id, nom, prenom, age, classe) {
    if (!id || isNaN(id))
      return { success: false, message: 'ID invalide.' };

    const trouve = findStudent(String(id));
    if (!trouve || trouve.length === 0) {
      logger.warning(`Modification échouée : étudiant ID ${id} introuvable`);
      return { success: false, message: `Aucun étudiant trouvé avec l'ID ${id}.` };
    }

    const erreur = validerChamps(nom, prenom, age);
    if (erreur) {
      logger.warning(`Modification étudiant échouée : ${erreur}`);
      return { success: false, message: erreur };
    }

    updateStudent(id, nom.trim(), prenom.trim(), Number(age), classe);
    logger.info(`Étudiant modifié : ID ${id} — ${prenom} ${nom}`);
    return { success: true, message: 'Étudiant modifié avec succès.' };
  },

  removeStudent(id) {
    if (!id || isNaN(id))
      return { success: false, message: 'ID invalide.' };

    const trouve = findStudent(String(id));
    if (!trouve || trouve.length === 0) {
      logger.warning(`Suppression échouée : étudiant ID ${id} introuvable`);
      return { success: false, message: `Aucun étudiant trouvé avec l'ID ${id}.` };
    }

    deleteStudent(id);
    logger.info(`Étudiant supprimé : ID ${id}`);
    return { success: true, message: 'Étudiant supprimé avec succès.' };
  },

  searchStudent(query) {
    if (!query || query.trim() === '')
      return { success: false, message: 'Veuillez entrer un terme de recherche.' };

    const results = findStudent(query.trim());
    logger.info(`Recherche "${query}" : ${results.length} résultat(s)`);
    return { success: true, data: results };
  },

  listStudents() {
    const students = getAllStudents();
    logger.info(`Liste étudiants : ${students.length} trouvé(s)`);
    return { success: true, data: students };
  },

};

export default studentService;