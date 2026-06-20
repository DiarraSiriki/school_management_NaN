const userModel = require('../models/userModel');
const logger = require('../utils/logger');
const ROLES = ['admin', 'professeur', 'étudiant'];
function addUser(name, role) {
if (!name || !ROLES.includes(role)) {
logger.warning(`Ajout utilisateur échoué — données invalides`);
return { success: false, message: 'Nom ou rôle invalide.' };
}
userModel.createUser(name, role);
logger.info(`Utilisateur ajouté : ${name} (${role})`);
return { success: true };
}
function removeUser(id) {
userModel.deleteUser(id);
logger.info(`Utilisateur supprimé : id=${id}`);
}
function listUsers() {
return userModel.getAllUsers();
}
module.exports = { addUser, removeUser, listUsers };