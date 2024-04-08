const { rss, torrent } = require('../utils')

const scanRSS = {
    work: async () => {
        global.logger.info('Scanning subscribed RSS')
        let result = await rss.getSubscribed()
        if (result.code < 0) return;
        let newTorrent = 0
        for (let i = 0; i < result.data.length; i++) {
            let resScan = await rss.scanRSS(result.data[i].rid)
            newTorrent += await torrent.saveScan(resScan)
        }
        if(newTorrent > 0) global.logger.info(`${newTorrent} new torrent(s) were scanned`)
        await torrent.filenameRecognize()
        await torrent.torrentDownloadScan()
        return
    }
}

module.exports = scanRSS;