const nodemailer = require('nodemailer');
const mailConfig = require('@config/mail');
const logger = require('@core/logger');

class SMTPCore {
    constructor() {
        const config = mailConfig.getSmtpConfig();
        logger.debug('Initializing SMTP transporter with config:', config);
        this.transporter = nodemailer.createTransport({
            host: config.host || 'localhost',
            port: config.port || 25,
            secure: config.secure || false,
            auth: {
                user: config.user,
                pass: config.password
            },
            tls: {
                rejectUnauthorized: config.tls?.rejectUnauthorized || false
            }
        });
        logger.info('SMTP transporter initialized');
    }

    /**
     * 发送邮件
     * @param {Object} mailOptions 邮件选项
     * @param {String} mailOptions.from 发件人
     * @param {String|Array} mailOptions.to 收件人
     * @param {String} mailOptions.subject 主题
     * @param {String} mailOptions.text 纯文本内容
     * @param {String} mailOptions.html HTML内容
     * @returns {Promise} 
     */
    async sendMail(mailOptions) {
        try {
            logger.info('Sending email:', {
                to: mailOptions.to,
                subject: mailOptions.subject
            });
            logger.debug('Full email options:', mailOptions);
            const result = await this.transporter.sendMail(mailOptions);
            logger.info('Email sent successfully:', result.messageId);
            return result;
        } catch (error) {
            logger.error('Failed to send email:', error);
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
            const result = await this.transporter.verify();
            logger.info('SMTP connection verified successfully');
            return result;
        } catch (error) {
            logger.error('Failed to verify SMTP connection:', error);
            throw error;
        }
    }
}

module.exports = new SMTPCore();