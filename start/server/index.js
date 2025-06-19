const express = require('express');
const logger = require('@core/logger');

module.exports = {
    async init(port) {
        try {
            const app = express();
            
            // 设置Express中间件
            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));
            
            // 启动服务器
            app.listen(port, () => {
                logger.info(`Server running on port ${port}`);
            });
            
            return app;
        } catch (error) {
            logger.error('Failed to initialize server:', error);
            throw error;
        }
    }
};