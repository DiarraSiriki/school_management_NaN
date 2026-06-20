import { createUser, deleteUser, getAllUsers } from '../models/userModel.js';
import logger from '../utils/logger.js';
import bcrypt from 'bcrypt';

const ROLES_VALIDES = ['admin', 'professeur', 'étudiant'];
const SALT_ROUNDS = 10;

const userService = {

  async addUser(name, role, email, password) {
    // Validations
    if (!name || name.trim() === '') {
      logger.warning('Ajout échoué : nom vide');
      return { success: false, message: 'Le nom ne peut pas être vide.' };
    }
    if (!ROLES_VALIDES.includes(role)) {
      logger.warning(`Ajout échoué : rôle invalide "${role}"`);
      return { success: false, message: `Rôle invalide. Choisir parmi : ${ROLES_VALIDES.join(', ')}` };
    }
    if (!email || !email.includes('@')) {
      logger.warning(`Ajout échoué : email invalide "${email}"`);
      return { success: false, message: 'Email invalide.' };
    }
    if (!password || password.length < 6) {
      logger.warning('Ajout échoué : mot de passe trop court');
      return { success: false, message: 'Le mot de passe doit contenir au moins 6 caractères.' };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const result = createUser(name.trim(), role, email.trim(), hashedPassword);
    logger.info(`Utilisateur ajouté : ${name} (${role}) — ${email}`);
    return { success: true, message: 'Utilisateur ajouté avec succès.', id: result.lastInsertRowid };
  },

  removeUser(id) {
    if (!id || isNaN(id)) {
      logger.warning(`Suppression échouée : ID invalide "${id}"`);
      return { success: false, message: 'ID invalide.' };
    }

    const result = deleteUser(id);
    if (result.changes === 0) {
      logger.warning(`Suppression échouée : utilisateur ID ${id} introuvable`);
      return { success: false, message: `Aucun utilisateur trouvé avec l'ID ${id}.` };
    }

    logger.info(`Utilisateur supprimé : ID ${id}`);
    return { success: true, message: 'Utilisateur supprimé avec succès.' };
  },

  listUsers() {
    const users = getAllUsers();
    // Masquer les mots de passe dans les retours
    const usersSafe = users.map(({ password, ...rest }) => rest);
    logger.info(`Liste utilisateurs : ${usersSafe.length} trouvé(s)`);
    return { success: true, data: usersSafe };
  },

};

export default userService;