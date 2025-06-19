const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const tls = require('tls');
const { promisify } = require('util');

class TLSConfig {
    constructor() {
        this.configPath = path.join(__dirname, 'config.yml');
        this.config = this.loadConfig();
        this.certs = new Map();
    }

    loadConfig() {
        try {
            const fileContents = fs.readFileSync(this.configPath, 'utf8');
            return yaml.load(fileContents);
        } catch (e) {
            console.error('Failed to load TLS config:', e);
            return {};
        }
    }

    async verifyCertificate(host, port = 443) {
        const opts = {
            host,
            port,
            rejectUnauthorized: false,
            servername: host
        };

        try {
            const socket = tls.connect(opts);
            const cert = await new Promise((resolve, reject) => {
                socket.on('secureConnect', () => {
                    resolve(socket.getPeerCertificate());
                    socket.destroy();
                });
                socket.on('error', reject);
            });

            this.certs.set(`${host}:${port}`, {
                validFrom: cert.valid_from,
                validTo: cert.valid_to,
                issuer: cert.issuer,
                subject: cert.subject
            });

            return {
                isValid: new Date(cert.valid_to) > new Date(),
                details: cert
            };
        } catch (err) {
            return { isValid: false, error: err.message };
        }
    }

    getCertDetails(host, port = 443) {
        return this.certs.get(`${host}:${port}`) || null;
    }

    reload() {
        this.config = this.loadConfig();
        return this.config;
    }

    getConfig() {
        return this.config.tls || {};
    }
}

module.exports = new TLSConfig();