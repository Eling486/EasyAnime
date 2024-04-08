const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const fs = require('fs')
const DB_TEMPLATE_FILE = 'EasyAnime.sqlite'
const DB_TEMPLATE_PATH = path.resolve(path.join('./src/db', DB_TEMPLATE_FILE))
const DB_PATH = path.resolve(path.join('../data', DB_TEMPLATE_FILE))

if(!fs.existsSync(DB_PATH)){
    fs.copyFileSync(DB_TEMPLATE_PATH, DB_PATH)
}

class sqlite {

    constructor(){
        this.DB_TEMPLATE_FILE = DB_TEMPLATE_FILE
        this.DB_TEMPLATE_PATH = DB_TEMPLATE_PATH
        this.DB_PATH = DB_PATH
        this.db = new sqlite3.Database(DB_PATH)
        return this
    }
    
    async reset() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    return reject(err)
                }
                fs.copyFileSync(DB_TEMPLATE_PATH, DB_PATH)
                this.db = new sqlite3.Database(DB_PATH, (err)=> {
                    if (err) {
                        return reject(err)
                    }
                    resolve(this)
                })
            })
        })
    }
}

module.exports = sqlite;