const logger = require('./utils/logger');
const { initDatabase } = require('./db/init');

logger.info('Démarrage du système');

initDatabase();