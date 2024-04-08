const sqlite = require('./sqlite')

class db {

    constructor() {
        this.sqlite = new sqlite()
        this.db = this.sqlite.db
        this.user = {
            getByUsername: async (username) => {
                return await this.search(`SELECT * FROM user WHERE username = ?`, [username])
            },
            getByUid: async (uid) => {
                return await this.search(`SELECT * FROM user WHERE uid = ?`, [uid])
            },
            updateByUid: async (uid, username, password) => {
                console.log(uid, username, password)
                let err = await this.runSync(`UPDATE user SET username=?, password=? WHERE uid = ?;`, [username, password, uid])
                if (err) {
                    global.logger.error(err)
                    return -1
                };
                return 0
            }
        }
        this.rss = {
            add: async (data) => {
                if(!data.is_subscribe) data['is_subscribe'] = false
                let result = await this.search(`SELECT * FROM rss WHERE url = ?;`, [data.url])
                if (result.code < 0) return -1;
                if (result.data.length > 0) {
                    const RID = result.data[0].rid
                    data.title = data.title || result.data[0].title;
                    data.name = data.name || result.data[0].name;
                    data.url = data.url || result.data[0].url;
                    data.meta = data.meta || result.data[0].meta;
                    data.source = data.source || result.data[0].source;

                    let err = await this.runSync(`UPDATE rss SET title=?, name=?, url=?, meta=?, source=?, is_subscribe=?, filter=? WHERE rid = ?;`, [data.title, data.name, data.url, data.meta, data.source, Number(data.is_subscribe), data.filter, RID])
                    if (err) return -1;
                    return {
                        rid: RID,
                        new_rss: false
                    }
                }
                let err = await this.runSync(`INSERT INTO rss (title, name, url, meta, source, is_subscribe, filter) VALUES (?, ?, ?, ?, ?, ?, ?);`, [data.title, data.name, data.url, data.meta, data.source, Number(data.is_subscribe), data.filter])
                if (err) return -1;

                result = await this.search(`SELECT * FROM rss WHERE url = ?;`, [data.url])
                if (result.code < 0) return -1;
                return {
                    rid: result.data[0].rid,
                    new_rss: true
                }
            },
            get: async (rid = null) => {
                if (!rid) {
                    return await this.search(`SELECT * FROM rss;`)
                }
                return await this.search(`SELECT * FROM rss WHERE rid = ?;`, rid)
            },
            getByUrl: async (url) => {
                if(!url) return null
                return await this.search(`SELECT * FROM rss WHERE url = ?;`, url)
            },
            getSubscribed: async () => {
                return await this.search(`SELECT * FROM rss WHERE is_subscribe = ?;`, 1)
            },
            updateAid: async (rid, aid) => {
                let err = await this.runSync(`UPDATE rss SET aid=? WHERE rid = ?;`, [aid, rid])
                if (err) return -1;
                return 0
            },
            updateSubscribe: async (rid, isSubscribe) => {
                let err = await this.runSync(`UPDATE rss SET is_subscribe=? WHERE rid = ?;`, [Number(isSubscribe), rid])
                if (err) return -1;
                return 0
            },
            delete: async (rid) => {
                if(!rid) return -1
                let err = await this.runSync(`DELETE FROM rss WHERE rid = ?;`, rid)
                if (err) return -1;
                return 0
            }
        }
        this.anime = {
            add: async (data) => {
                let result = await this.search(`SELECT * FROM anime WHERE title = ?;`, [data.title])
                if (result.code < 0) return -1;
                if (result.data.length > 0) {
                    let seasonList = JSON.parse(result.data[0].season)
                    if(seasonList.indexOf(data.season) < 0 && data.season){
                        seasonList.push(data.season)
                        await this.runSync(`UPDATE anime SET season = ? WHERE aid = ?;`, [JSON.stringify(seasonList), result.data[0].aid])
                    }
                    return result.data[0].aid
                }

                let err = await this.runSync(`INSERT INTO anime (title, meta_db, meta_id, meta_update_time, meta_title, season, source, filter, poster_url, poster_path, save_path, is_subscribe, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?);`, [data.title, data.meta_db, data.meta_id, data.meta_update_time, data.meta_title, JSON.stringify([data.season]), data.source, data.filter, data.poster_url, data.poster_path, data.save_path, Number(data.is_subscribe), Date.now()])
                if (err) return -1;

                result = await this.search(`SELECT * FROM anime WHERE title = ?;`, [data.title])
                if (result.code < 0) return -1;
                return result.data[0].aid
            },
            get: async (aid = null) => {
                if (!aid) {
                    return await this.search(`SELECT * FROM anime`)
                }
                return await this.search(`SELECT * FROM anime WHERE aid = ?`, aid)
            },
            getByTitle: async (title = null) => {
                if (!title) {
                    return await this.search(`SELECT * FROM anime`)
                }
                return await this.search(`SELECT * FROM anime WHERE title = ?`, title)
            },
            updatePoster: async (aid, imgUrl, imgPath) => {
                let err = await this.runSync(`UPDATE anime SET poster_url = ?, poster_path = ? WHERE aid = ?`, [imgUrl, imgPath, aid])
                if (err) return -1;
                return 0;
            }
        }
        this.torrent = {
            add: async (data) => {
                let result = await this.search(`SELECT * FROM torrent WHERE url = ?;`, [data.url])
                if (result.code < 0) return -1;
                if (result.data.length > 0) return result.data[0].tid

                let err = await this.runSync(`INSERT INTO torrent (aid, rid, title, homepage, url, content_length, meta, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`, [data.aid, data.rid, data.title, data.homepage, data.url, data.content_length, data.meta, data.state ])
                if (err) return -1;
                return 0;
            },
            get: async (tid = null) => {
                if (!tid) {
                    return await this.search(`SELECT * FROM torrent`)
                }
                return await this.search(`SELECT * FROM torrent WHERE tid = ?`, tid)
            },
            getByState: async (state = 0) => {
                return await this.search(`SELECT * FROM torrent WHERE state = ?`, state)
            },
            getByHash: async (hash) => {
                return await this.search(`SELECT * FROM torrent WHERE hash = ?`, hash)
            },
            getByUrl: async (url) => {
                if(!url) return await this.search(`SELECT * FROM torrent WHERE url = ?`, url);
                return await this.search(`SELECT * FROM torrent WHERE url = ?`, url)
            },
            getByFileName: async (file_name = null) => {
                if(!file_name) {
                    return await this.search(`SELECT * FROM torrent WHERE file_name IS NOT NULL`)
                }
                return await this.search(`SELECT * FROM torrent WHERE file_name = ?`, file_name)
            },
            getByFilenameEmpty: async () => {
                return await this.search(`SELECT * FROM torrent WHERE file_name IS NULL`)
            },
            getByAid: async (aid) => {
                return await this.search(`SELECT * FROM torrent WHERE aid = ?`, aid)
            },
            updateFilename: async (tid, filename) => {
                let err = await this.runSync(`UPDATE torrent SET file_name = ? WHERE tid = ?`, [filename, tid])
                if (err) return -1;
                return 0;
            },
            updateSameEp: async (tid, filename) => {
                let err = await this.runSync(`UPDATE torrent SET file_name = ?, state = ? WHERE tid = ?`, [filename, -5, tid])
                if (err) return -1;
                return 0;
            },
            updateState: async (tidList = [], state) => {
                let err = await this.runSync(`UPDATE torrent SET state = ? WHERE tid IN (${tidList.join(',')})`, [state])
                if (err) return -1;
                return 0;
            },
            updateHash: async (tid = null, hash) => {
                let err = await this.runSync(`UPDATE torrent SET hash = ? WHERE tid = ?`, [hash, tid])
                if (err) return -1;
                return 0;
            },
            downloadUpdate: async (tid, hash, state) => {
                let err = await this.runSync(`UPDATE torrent SET hash = ?, state=? WHERE tid = ?`, [hash, state, tid])
                if (err) return -1;
                return 0;
            }
        }
        return this
    }

    async reset() {
        this.sqlite = await this.sqlite.reset()
        this.db = this.sqlite.db
        return this
    }

    async runSync(sql, param = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, param, (err) => {
                if (err) {
                    global.logger.error(err)
                    return resolve(err)
                }
                return resolve()
            })
        })
    }
    async search(sql, param = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, param, (err, rows) => {
                if (err) {
                    global.logger.error(err)
                    return reject({
                        code: -1,
                        msg: err
                    })
                }
                return resolve({
                    code: 0,
                    msg: 'ok',
                    data: rows
                })
            })
        })
    }
}


module.exports = db;