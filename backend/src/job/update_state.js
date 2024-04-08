const updateState = {
    cron: '0/10 * * * * *',
    work: async () => {
        let tidList = []
        let data = await global.db.torrent.getByState(2);
        if(data.code < 0) return
        //global.logger.info(`Downloading ${data.data.length} file(s)`)
        for(let i = 0; i < data.data.length; i++){
            let resInfo = await global.qb.client.torrents.info({
                hashes: data.data[i].hash
            }).catch((err) => {
                if(err.code == 'ECONNREFUSED') return global.logger.error('Cannot connect to qBittorrent!');
                global.logger.error(err)
            })
            if (!resInfo) {
                break
            }
            if(resInfo.length == 0) {
                await global.db.torrent.updateState([data.data[i].tid], -4);
                continue
            }
            if(resInfo[0].progress == 1) tidList.push(data.data[i].tid)
        }
        if(tidList.length > 0) await global.db.torrent.updateState(tidList, 3);
    }
}

module.exports = updateState;