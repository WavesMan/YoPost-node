require('module-alias/register');

const express = require('express');
const dbCore = require('@core/db');
const smtpCore = require('@core/mail/smtp');
const imapCore = require('@core/mail/imap');
const logger = require('@core/logger');

class App {
    constructor() {
        this.port = process.env.PORT || 3000;
        this.isDev = process.env.NODE_ENV === 'development';
        this.errors = [];
    }

    async initialize() {
        try {
            logger.info('Starting application initialization...');
            
            // 加载启动模块
            const startDB = require('./start/db');
            const startMail = require('./start/mail');
            const startServer = require('./start/server');
            
            // 按顺序初始化
            await this.runWithErrorHandling(startDB.init, 'Database');
            await this.runWithErrorHandling(startMail.init, 'Mail');
            await this.runWithErrorHandling(() => startServer.init(this.port), 'Server');
            
            if (this.errors.length > 0) {
                logger.error('Application initialized with errors:', this.errors);
            } else {
                logger.info('Application initialized successfully');
            }
        } catch (error) {
            logger.error('Failed to initialize application:', error);
            process.exit(1);
        }
    }

    async runWithErrorHandling(fn, moduleName) {
        try {
            await fn();
            logger.info(`${moduleName} initialized successfully`);
        } catch (error) {
            logger.error(`${moduleName} initialization failed:`, error);
            this.errors.push({ module: moduleName, error });
            
            if (!this.isDev) {
                throw error;
            }
        }
    }
}

// 启动应用
const app = new App();
app.initialize();