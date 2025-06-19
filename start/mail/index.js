const logger = require('@core/logger');
const smtp = require('./smtp');
const imap = require('./imap');

module.exports = {
    async init() {
        try {
            logger.debug('Initializing mail system...');
            await smtp.init();
            await imap.init();
            logger.info('Mail system initialized successfully');
            return { smtp, imap };
        } catch (error) {
            logger.error('Failed to initialize mail system:', error);
            throw error;
        }
    }
};