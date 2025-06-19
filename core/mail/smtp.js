const nodemailer = require('nodemailer');
const mailConfig = require('@config/mail');
const logger = require('@core/logger');
const fs = require('fs');
const path = require('path');

class SMTPCore {
    constructor() {
        this.config = mailConfig.getSmtpConfig();
        this.mailDir = path.join(__dirname, '../../storage/mail');
        this.initStorage();
        logger.debug('Initializing SMTP server with config:', this.config);
        
        const defaultPort = this.config.secure ? 
            (this.config.TLSport1 || this.config.TLSport2 || 465) : 
            (this.config.NoTLSport || 25);
            
        this.transporter = nodemailer.createTransport({
            host: this.config.host || 'localhost',
            port: this.config.port || defaultPort,
            secure: this.config.secure || false,
            auth: this.config.user ? {
                user: this.config.user,
                pass: this.config.password
            } : undefined,
            tls: {
                rejectUnauthorized: this.config.tls?.rejectUnauthorized || false
            },
            connectionTimeout: 5000,
            socketTimeout: 10000,
            onData: (stream, callback) => this.handleIncomingMail(stream, callback)
        });
        
        this.initEventHandlers();
        logger.info('SMTP server initialized');
    }

    initStorage() {
        if (!fs.existsSync(this.mailDir)) {
            fs.mkdirSync(this.mailDir, { recursive: true });
        }
    }

    initEventHandlers() {
        this.transporter.on('mail', (address, session) => {
            logger.info(`Incoming mail from ${address}`, { session });
        });
    }

    // 处理接收到的邮件
    async handleIncomingMail(stream, callback) {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', async () => {
            try {
                const raw = Buffer.concat(chunks).toString();
                await this.storeMail(raw);
                callback(null, '250 Message accepted');
            } catch (err) {
                callback(err);
            }
        });
    }

    // 存储邮件到文件系统
    async storeMail(raw) {
        const mailId = Date.now();
        const mailPath = path.join(this.mailDir, `${mailId}.eml`);
        await fs.promises.writeFile(mailPath, raw);
        logger.debug(`Mail stored at ${mailPath}`);
        return mailPath;
    }

    /**
     * 发送邮件
     * @param {Object} mailOptions - 邮件选项
     * @param {string} mailOptions.from - 发件人
     * @param {string|Array} mailOptions.to - 收件人
     * @param {string} mailOptions.subject - 邮件主题
     * @param {string} mailOptions.text - 纯文本内容
     * @param {string} mailOptions.html - HTML内容
     * @param {Array} [mailOptions.attachments] - 附件
     * @returns {Promise}
     */
    async sendMail(mailOptions) {
        try {
            const info = await this.transporter.sendMail({
                from: mailOptions.from || this.config.user,
                to: mailOptions.to,
                subject: mailOptions.subject,
                text: mailOptions.text,
                html: mailOptions.html,
                attachments: mailOptions.attachments || []
            });
            
            logger.info('Message sent: %s', info.messageId);
            return info;
        } catch (error) {
            logger.error('Failed to send mail:', error);
            throw error;
        }
    }

    /**
     * 验证SMTP连接
     * @returns {Promise}
     */
    async verify() {
        try {
            logger.info('Verifying SMTP connection...');
            await this.transporter.verify();
            logger.info('SMTP connection verified successfully');
            return true;
        } catch (error) {
            logger.error('Failed to verify SMTP connection:', error);
            throw error;
        }
    }

}

module.exports = new SMTPCore();