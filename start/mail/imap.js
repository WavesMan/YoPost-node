const imapCore = require('@core/mail/imap');
const logger = require('@core/logger');

module.exports = {
    async init() {
        try {
            logger.debug('Initializing IMAP...');
            return imapCore;
        } catch (error) {
            logger.error('Failed to initialize IMAP:', error);
            throw error;
        }
    }
};