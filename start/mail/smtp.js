const smtpCore = require('@core/mail/smtp');
const logger = require('@core/logger');

module.exports = {
    async init() {
        try {
            logger.debug('Initializing SMTP...');
            return smtpCore;
        } catch (error) {
            logger.error('Failed to initialize SMTP:', error);
            throw error;
        }
    }
};