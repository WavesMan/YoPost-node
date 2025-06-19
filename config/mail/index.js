const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

class MailConfig {
    constructor() {
        this.configPath = path.join(__dirname, 'config.yml');
        this.config = this.loadConfig();
        this.tlsConfig = require('../tls');  // 新增TLS配置引用
    }

    loadConfig() {
        try {
            const fileContents = fs.readFileSync(this.configPath, 'utf8');
            return yaml.load(fileContents);
        } catch (e) {
            console.error('Failed to load mail config:', e);
            return {};
        }
    }

    getSmtpConfig() {
        return this.config.smtp || {};
    }

    reload() {
        this.config = this.loadConfig();
        return this.config;
    }

    async verifySmtpTls() {
        const smtpConfig = this.getSmtpConfig();
        if (smtpConfig.secure || smtpConfig.tls) {
            return await this.tlsConfig.verifyCertificate(
                smtpConfig.host, 
                smtpConfig.TLSport1 || smtpConfig.TLSport2 || smtpConfig.NoTLSport
            );
        }
        return { isValid: false, error: 'TLS not enabled' };
    }
}

module.exports = new MailConfig();