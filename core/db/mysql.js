const mysql = require('mysql2/promise');
const dbConfig = require('@db');
const logger = require('@core/logger');

class MySQLCore {
    constructor() {
        this.pool = null;
        this.config = dbConfig.getMySQLConfig();
    }

    async init() {
        try {
            logger.info('Initializing MySQL connection pool...');
            this.pool = mysql.createPool({
                host: this.config.host,
                user: this.config.user,
                password: this.config.password,
                database: this.config.database,
                port: this.config.port,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            
            logger.debug('MySQL pool created successfully');
            return this.pool;
        } catch (error) {
            logger.error('Failed to initialize MySQL pool:', error);
            throw error;
        }
    }

    async getConnection() {
        try {
            logger.debug('Acquiring MySQL connection...');
            const conn = await this.pool.getConnection();
            logger.debug('MySQL connection acquired');
            return conn;
        } catch (error) {
            logger.error('Failed to get MySQL connection:', error);
            throw error;
        }
    }

    // 其他数据库操作方法可以在此添加
    // 例如：query, transaction等
}

module.exports = new MySQLCore();