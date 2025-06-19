const Imap = require('imap');
const mailConfig = require('@config/mail');
const logger = require('@core/logger');
const fs = require('fs');
const path = require('path');
const { MailParser } = require('mailparser');

class IMAPCore {
    constructor() {
        this.config = mailConfig.getImapConfig();
        this.mailDir = path.join(__dirname, '../../storage/mail');
        this.initMailboxes();
        logger.debug('Initializing IMAP server with config:', this.config);
        
        this.imap = new Imap({
            keepAlive: true,
            // 自定义邮件存储处理
            mailboxes: this.getMailboxes(),
            // 邮件检索回调
            search: this.searchMails.bind(this)
        });

        this.initEventHandlers();
        logger.info('IMAP server initialized');
    }

    initMailboxes() {
        const inboxPath = path.join(this.mailDir, 'INBOX');
        if (!fs.existsSync(inboxPath)) {
            fs.mkdirSync(inboxPath, { recursive: true });
        }
    }

    getMailboxes() {
        return {
            'INBOX': {
                // 邮件检索和处理逻辑
                // 可根据需要添加更多邮箱
            }
        };
    }

    initEventHandlers() {
        this.imap.on('error', err => {
            logger.error('IMAP error:', err);
        });

        this.imap.on('end', () => {
            logger.info('IMAP connection ended');
        });

        this.imap.on('mail', (mail) => {
            this.processMail(mail);
        });
    }

    processMail(mail) {
        const parser = new MailParser();
        parser.on('data', (data) => {
            logger.info('Received mail:', data);
            // 处理邮件数据
        });

        parser.on('end', () => {
            logger.info('Mail processed successfully');
        });

        parser.on('error', (err) => {
            logger.error('Failed to process mail:', err);
        });

        parser.write(mail);
        parser.end();
    }

    searchMails(query, callback) {
        this.imap.search(query, (err, results) => {
            if (err) {
                logger.error('Failed to search mails:', err);
                callback(err);
            } else {
                logger.info('Mails found:', results);
                callback(null, results);
            }
        });
    }

    async verify() {
        try {
            logger.debug('Verifying IMAP configuration');
            return true;
        } catch (error) {
            logger.error('Failed to verify IMAP configuration:', error);
            throw error;
        }
    }
}

module.exports = new IMAPCore();