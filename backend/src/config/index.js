const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

class Config {
    constructor() {
        this.CONFIG_PATH = path.join('../data', 'config.yml')
        this.readConfigFile()
        return this
    }

    readConfigFile() {
        this.CONFIG_DEFAULT_FILE = fs.readFileSync('./src/config/default.yml', 'utf8')
        this.CONFIG_DEFAULT = yaml.load(this.CONFIG_DEFAULT_FILE)
        if(!fs.existsSync(this.CONFIG_PATH)){
            fs.writeFileSync(this.CONFIG_PATH, this.CONFIG_DEFAULT_FILE)
        }
        this.CONFIG_FILE = fs.readFileSync(this.CONFIG_PATH, 'utf8')
        
        this.config = yaml.load(this.CONFIG_FILE)
        
        if (!this.config) {
            this.config = this.CONFIG_DEFAULT
        }
        
        // Set default settings
        Object.keys(this.CONFIG_DEFAULT).forEach(key => {
            if (!this.config[key] && this.config[key] !== false) {
                this.config[key] = this.CONFIG_DEFAULT[key]
            }
        })

        this.config.ca.key = path.resolve('../', this.config.ca.key)
        this.config.ca.cert = path.resolve('../', this.config.ca.cert)
    }

    update(key, data){
        this.config[key] = data
        fs.writeFileSync(this.CONFIG_PATH, yaml.dump(this.config), 'utf8');
        this.readConfigFile()
        global.sm.restart()
    }

    replace(newConfig){
        this.config = newConfig
        fs.writeFileSync(this.CONFIG_PATH, yaml.dump(this.config), 'utf8');
        this.readConfigFile()
        global.sm.restart()
        global.qb.restart()
    }
}

module.exports = Config;