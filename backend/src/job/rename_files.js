const fs = require('fs')
const path = require('path')

const renameFiles = {
    cron: '0/5 * * * * *',
    work: async () => {
        let data = await global.db.torrent.getByState(1);
        if (data.code < 0) return
        //if(data.data.length > 0) global.logger.info(`${data.data.length} file(s) are waiting to be renamed`)
        for (let i = 0; i < data.data.length; i++) {
            if (!data.data[i].file_name) {
                await global.db.torrent.updateState([data.data[i].tid], 2)
                continue
            }
            let resInfo = await global.qb.client.torrents.info({
                hashes: data.data[i].hash
            }).catch((err) => {
                if (err.code == 'ECONNREFUSED') return global.logger.error('Cannot connect to qBittorrent!');
                global.logger.error(err)
            })
            if (!resInfo) {
                break
            }
            if (resInfo.length == 0) {
                //await global.db.torrent.updateState([data.data[i].tid], -4)
                continue
            }
            let qbItem = resInfo[0]
            let qbError = false
            let oldPath = path.basename(qbItem.content_path)
            let ext = path.extname(oldPath);
            let newPath = `${data.data[i].file_name}${ext}`
            if(oldPath == newPath) {
                global.logger.info(`Renamed ${newPath}`)
                await global.db.torrent.updateState([data.data[i].tid], 2)
                continue
            }
            if (ext) {
                await global.qb.client.torrents.renameFile(data.data[i].hash, oldPath, newPath).catch((err) => {
                    if (err.code == 'ECONNREFUSED') {
                        qbError = true
                        return global.logger.error('Cannot connect to qBittorrent!')
                    }
                    if (err.statusCode == 409) return
                    global.logger.error(err)
                })
                continue
            }
            await global.qb.client.torrents.renameFolder(data.data[i].hash, oldPath, newPath).catch((err) => {
                if (err.code == 'ECONNREFUSED') {
                    qbError = true
                    return global.logger.error('Cannot connect to qBittorrent!')
                }
                if (err.statusCode == 409) return
                global.logger.error(err)
            })
            if (qbError) break
        }
    }
}

module.exports = renameFiles;