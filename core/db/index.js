const mysqlCore = require('./mysql');
const mongodbCore = require('./mongodb');
const logger = require('@core/logger');

class DBCore {
    constructor() {
        this.mysql = null;
        this.mongodb = null;
    }

    async init() {
        try {
            logger.info('Initializing database connections...');
            this.mysql = await mysqlCore.init();
            this.mongodb = await mongodbCore.init();
            logger.info('All database connections initialized');
            return {
                mysql: this.mysql,
                mongodb: this.mongodb
            };
        } catch (error) {
            logger.error('Failed to initialize database connections:', error);
            throw error;
        }
    }
}

module.exports = new DBCore();