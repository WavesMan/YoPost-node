const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

class DBConfig {
    constructor() {
        this.configPath = path.join(__dirname, 'config.yml');
        this.config = this.loadConfig();
    }

    loadConfig() {
        try {
            const fileContents = fs.readFileSync(this.configPath, 'utf8');
            return yaml.load(fileContents);
        } catch (e) {
            console.error('Failed to load DB config:', e);
            return {};
        }
    }

    getMySQLConfig() {
        return this.config.databases?.mysql || {};
    }

    getMongoDBConfig() {
        return this.config.databases?.mongodb || {};
    }

    reload() {
        this.config = this.loadConfig();
        return this.config;
    }
}

module.exports = new DBConfig();