require('module-alias/register');

const express = require('express');
const dbCore = require('@core/db');
const smtpCore = require('@core/mail/smtp');
const logger = require('@core/logger');

class App {
    constructor() {
        this.port = process.env.PORT || 3000;
    }

    async initialize() {
        try {
            logger.info('Starting application initialization...');
            
            // 加载启动模块
            const startDB = require('./start/db');
            const startMail = require('./start/mail');
            const startServer = require('./start/server');
            
            // 按顺序初始化
            await startDB.init();
            await startMail.init();
            await startServer.init(this.port);
            
            logger.info('Application initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize application:', error);
            process.exit(1);
        }
    }
}

// 启动应用
const app = new App();
app.initialize();