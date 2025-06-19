const smtpCore = require('@core/mail/smtp');
const logger = require('@core/logger');

module.exports = {
    async init() {
        try {
            logger.debug('Initializing SMTP connection...');
            await smtpCore.verify();
            logger.info('SMTP connection verified successfully');
            return smtpCore;
        } catch (error) {
            logger.error('Failed to initialize SMTP connection:', error);
            throw error;
        }
    }
};