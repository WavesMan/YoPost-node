const { MongoClient } = require('mongodb');
const dbConfig = require('@db');
const logger = require('@core/logger');

class MongoDBCore {
    constructor() {
        this.client = null;
        this.db = null;
        this.config = dbConfig.getMongoDBConfig();
        this.uri = `mongodb://${this.config.user}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.database}`;
    }

    async init() {
        try {
            logger.info('Connecting to MongoDB...');
            this.client = new MongoClient(this.uri);
            await this.client.connect();
            this.db = this.client.db(this.config.database);
            logger.debug('MongoDB connected successfully');
            return this.db;
        } catch (error) {
            logger.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }

    async getCollection(collectionName) {
        try {
            logger.debug(`Getting MongoDB collection: ${collectionName}`);
            return this.db.collection(collectionName);
        } catch (error) {
            logger.error(`Failed to get collection ${collectionName}:`, error);
            throw error;
        }
    }

    // 其他数据库操作方法可以在此添加
    // 例如：insert, find, update等
}

module.exports = new MongoDBCore();