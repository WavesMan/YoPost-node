const imapCore = require('@core/mail/imap');
const logger = require('@core/logger');

module.exports = {
    async init() {
        try {
            logger.debug('Initializing IMAP connection...');
            await imapCore.verify();
            logger.info('IMAP connection verified successfully');
            return imapCore;
        } catch (error) {
            logger.error('Failed to initialize IMAP connection:', error);
            throw error;
        }
    }
};