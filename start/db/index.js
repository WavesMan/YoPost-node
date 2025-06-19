const dbCore = require('@core/db');
const logger = require('@core/logger');

module.exports = {
    async init() {
        try {
            logger.debug('Initializing database connections...');
            await dbCore.init();
            logger.info('Database connections initialized successfully');
            return dbCore;
        } catch (error) {
            logger.error('Failed to initialize database connections:', error);
            throw error;
        }
    }
};