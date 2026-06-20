import { createUser, updateUser, deleteUser, getAllUsers, getUserById, getUserByEmail } from '../models/userModel.js';
import logger from '../utils/logger.js';
import bcrypt from 'bcrypt';

const ROLES_VALIDES = ['admin', 'professeur', 'étudiant'];
const SALT_ROUNDS   = 10;

// Fonctions utilitaires de test

function validerChamps(name, role, email, password) {
  if (!name  || name.trim()  === '') return 'Le nom ne peut pas être vide.';
  if (!role  || !ROLES_VALIDES.includes(role)) return `Rôle invalide. Choisir parmi : ${ROLES_VALIDES.join(', ')}`;
  if (!email || !email.includes('@'))          return 'Email invalide.';
  if (password !== undefined && password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.';
  return null;
}

// ─── Service ─────────────────────────────────────────────────────────────────

const userService = {

  async addUser(name, role, email, password) {
    const erreur = validerChamps(name, role, email, password);
    if (erreur) {
      logger.warning(`Ajout utilisateur échoué : ${erreur}`);
      return { success: false, message: erreur };
    }

    // Vérifier unicité email
    const existant = getUserByEmail(email.trim());
    if (existant) {
      logger.warning(`Ajout utilisateur échoué : email "${email}" déjà utilisé`);
      return { success: false, message: 'Cet email est déjà utilisé.' };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const result         = createUser(name.trim(), role, email.trim(), hashedPassword);

    logger.info(`Utilisateur ajouté : ${name} (${role}) — ${email}`);
    return { success: true, message: 'Utilisateur ajouté avec succès.', id: result.lastInsertRowid };
  },

  async editUser(id, name, role, email) {
    if (!id || isNaN(id))
      return { success: false, message: 'ID invalide.' };

    const utilisateur = getUserById(id);
    if (!utilisateur) {
      logger.warning(`Modification échouée : utilisateur ID ${id} introuvable`);
      return { success: false, message: `Aucun utilisateur trouvé avec l'ID ${id}.` };
    }

    const erreur = validerChamps(name, role, email);
    if (erreur) {
      logger.warning(`Modification utilisateur échouée : ${erreur}`);
      return { success: false, message: erreur };
    }

    // Vérifier unicité email (sauf si c'est le même utilisateur)
    const existant = getUserByEmail(email.trim());
    if (existant && existant.id !== Number(id)) {
      return { success: false, message: 'Cet email est déjà utilisé par un autre utilisateur.' };
    }

    updateUser(id, name.trim(), role, email.trim());
    logger.info(`Utilisateur modifié : ID ${id} — ${name} (${role})`);
    return { success: true, message: 'Utilisateur modifié avec succès.' };
  },

  removeUser(id) {
    if (!id || isNaN(id))
      return { success: false, message: 'ID invalide.' };

    const utilisateur = getUserById(id);
    if (!utilisateur) {
      logger.warning(`Suppression échouée : utilisateur ID ${id} introuvable`);
      return { success: false, message: `Aucun utilisateur trouvé avec l'ID ${id}.` };
    }

    deleteUser(id);
    logger.info(`Utilisateur supprimé : ID ${id} — ${utilisateur.name}`);
    return { success: true, message: 'Utilisateur supprimé avec succès.' };
  },

  listUsers() {
    const users = getAllUsers();
    logger.info(`Liste utilisateurs : ${users.length} trouvé(s)`);
    return { success: true, data: users };
  },

  getUserById(id) {
    if (!id || isNaN(id))
      return { success: false, message: 'ID invalide.' };

    const utilisateur = getUserById(id);
    if (!utilisateur) {
      return { success: false, message: `Aucun utilisateur trouvé avec l'ID ${id}.` };
    }

    return { success: true, data: utilisateur };
  },

  async changePassword(id, ancienPassword, nouveauPassword) {
    if (!id || isNaN(id))
      return { success: false, message: 'ID invalide.' };

    const utilisateur = getUserByEmail(id);
    if (!utilisateur)
      return { success: false, message: `Aucun utilisateur trouvé avec l'ID ${id}.` };

    // Vérifier l'ancien mot de passe
    const valide = await bcrypt.compare(ancienPassword, utilisateur.password);
    if (!valide) {
      logger.warning(`Changement mot de passe échoué : ID ${id} — ancien mot de passe incorrect`);
      return { success: false, message: 'Ancien mot de passe incorrect.' };
    }

    if (!nouveauPassword || nouveauPassword.length < 6)
      return { success: false, message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' };

    const hashedPassword = await bcrypt.hash(nouveauPassword, SALT_ROUNDS);
    db.prepare('UPDATE users SET password=? WHERE id=?').run(hashedPassword, id);

    logger.info(`Mot de passe modifié : ID ${id}`);
    return { success: true, message: 'Mot de passe modifié avec succès.' };
  },

};

export default userService;