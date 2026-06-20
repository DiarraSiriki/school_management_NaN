const fs = require('fs');
const path = require('path');
const LOG_FILE = path.join(__dirname, '../logs/app.log');
function log(level, message) {
const date = new Date().toISOString().replace('T',' ').slice(0,19);
const line = `${date} [${level}] ${message}\n`;
fs.appendFileSync(LOG_FILE, line, 'utf8');
}
module.exports = {
info: (msg) => log('INFO', msg),
warning: (msg) => log('WARNING', msg),
error: (msg) => log('ERROR', msg),
};