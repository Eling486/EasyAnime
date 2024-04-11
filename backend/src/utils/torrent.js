const path = require('path')
const rss = require('./rss')
const anime = require('./anime')

const torrent = {
    saveScan: async (scanResult) => {
        let newTorrent = 0
        for (let i = 0; i < scanResult.length; i++) {
            const RID = scanResult[i].rid
            const IS_SUBSCRIBE = Boolean(Number(scanResult[i].is_subscribe))
            const FILTER = JSON.parse(scanResult[i].filter)
            for (let j = 0; j < scanResult[i].items.length; j++) {
                let aid = scanResult[i].aid
                let torrentItem = scanResult[i].items[j]

                let state = -1
                if (IS_SUBSCRIBE) state = 0;

                if (FILTER) {
                    for (let fi = 0; fi < FILTER.length; fi++) {
                        if (torrentItem.title.indexOf(FILTER[fi]) >= 0) {
                            state = -2
                            break
                        }
                        let re = new RegExp(FILTER[fi]);
                        if (re.test(torrentItem.title)) {
                            state = -2
                            break
                        }
                    }
                }

                let resUrl = await global.db.torrent.getByUrl(torrentItem.torrent.url)
                if (resUrl.code < 0) continue;
                if (resUrl.data.length > 0) {
                    if (resUrl.data[0].state > 0) continue;
                    if (state !== resUrl.data[0].state && resUrl.data[0].state !== -5) {
                        torrent.updateState([resUrl.data[0].tid], state)
                    }
                    newTorrent--
                };

                if (!aid) {
                    let season = torrentItem.meta.info.season
                    let animeMeta = await rss.parser[scanResult[i].source].getAnimeByHomepage(torrentItem.homepage)
                    if (animeMeta.season) season = animeMeta.season;
                    if (animeMeta.name) {
                        aid = await anime.addAnimeByData({
                            title: animeMeta.name,
                            season: season,
                            source: scanResult[i].source,
                            bangumiId: animeMeta.bangumiId,
                            is_subscribe: IS_SUBSCRIBE || global.config.config.subscribe,
                            filter: scanResult[i].filter || JSON.stringify(global.config.config.filter)
                        })
                    }
                }

                if (aid) {
                    // TODO: Debug
                    let animeData = await global.db.anime.get(aid)
                    if (animeData.code == 0) torrentItem.meta.info.name = animeData.data[0].title;
                }

                let err = await global.db.torrent.add({
                    aid: aid,
                    rid: RID,
                    title: torrentItem.title,
                    homepage: torrentItem.homepage,
                    url: torrentItem.torrent.url,
                    content_length: torrentItem.torrent.content_length,
                    meta: JSON.stringify(torrentItem.meta),
                    state: state
                })
                if (err < 0) global.logger.error('A database error occurred while inserting torrent');
                newTorrent++
            }
        }
        return newTorrent
    },
    getToday: async () => {
        return await global.db.torrent.getToday()
    },
    updateState: async (tidList, state) => {
        return await global.db.torrent.updateState(tidList, state)
    },
    filenameRecognize: async () => {
        let torrentList = await global.db.torrent.getByFilenameEmpty()
        if (torrentList.code < 0) return;
        for (let i = 0; i < torrentList.data.length; i++) {
            let torrentObj = torrentList.data[i]
            let tid = torrentObj.tid
            let meta = JSON.parse(torrentObj.meta)
            let name = meta.info.name
            let type = meta.type
            if (torrentObj.aid) {
                let animeObj = await global.db.anime.get(torrentObj.aid)
                if (torrentList.code == 0) {
                    name = animeObj.data[0].title
                }
            }

            let seasonText = ''
            let epText = ''
            if (meta.info.season) seasonText = ` S${meta.info.season.toString().padStart(2, '0')}`
            if (meta.info.ep) epText = `E${meta.info.ep.toString().padStart(2, '0')}`
            if (!seasonText && epText) epText = ` ${epText}`
            let fileName = `${name}${seasonText}${epText}`
            if (!name) fileName = null

            if (fileName) {
                let resultName = await global.db.torrent.getByFileName(fileName)
                if (resultName.data.length > 0) {
                    let isSameEp = false;
                    for (let j = 0; j < resultName.data.length; j++) {
                        if (resultName.data[j].state >= -1) isSameEp = true
                    }
                    if (isSameEp && torrentObj.state !== -2) {
                        await global.db.torrent.updateSameEp(tid, fileName)
                        continue
                    }
                };
                console.log(`update ${fileName}`)
                await global.db.torrent.updateFilename(tid, fileName)
            }
        }
    },
    torrentDownloadScan: async () => {
        let torrentList = await global.db.torrent.getByState(0)
        if (torrentList.code < 0) return torrentList;
        for (let i = 0; i < torrentList.data.length; i++) {
            let torrentObj = torrentList.data[i]
            let res = await torrent.torrentDownload(torrentObj)
            if (res === false) break;
        }
        return torrentList.data
    },
    torrentDownload: async (torrentObj) => {
        let tid = torrentObj.tid
        let fileName = torrentObj.file_name
        let meta = JSON.parse(torrentObj.meta)
        let name = meta.info.name
        let type = meta.type

        let savePath = global.config.config.save_path
        if (type == 'single' && fileName) {
            savePath = path.join(savePath, name)
            if (meta.info.season) savePath = path.join(savePath, `Season ${meta.info.season}`);
        }

        let qbError = false
        let hash = await global.qb.add(torrentObj.url, fileName, savePath).catch((err) => {
            if (err.code == 'ECONNREFUSED') {
                qbError = true
                return global.logger.error('Cannot connect to qBittorrent!')
            }
            global.logger.error(err)
        })
        if (qbError) return false
        if (!hash) {
            // await global.db.torrent.updateState([tid], -3)
            return false
        };
        // 已在队列中（与其他种子重复->跳过）
        if (typeof hash == 'object') {
            await global.db.torrent.updateState([tid], -6)
            return true
        };
        await global.db.torrent.downloadUpdate(tid, hash, 1)
        return hash
    },
    toggleEpTorrent: async (tidFrom, tidTo) => {
        if (tidFrom) {
            let torrentFromRes = await global.db.torrent.get(tidFrom)
            if (torrentFromRes.code < 0) return;
            if (torrentFromRes.data.length == 0) return;
            let torrentFromObj = torrentFromRes.data[0]
            await global.db.torrent.updateState([tidFrom], -5)
            if (torrentFromObj.hash) {
                let deleteRes = await global.qb.delete(torrentFromObj.hash)
                if (!deleteRes) return;
            }
        }
        let torrentToRes = await global.db.torrent.get(tidTo)
        if (torrentToRes.code < 0) return;
        if (torrentToRes.data.length == 0) return;
        let torrentToObj = torrentToRes.data[0]
        
        if(!tidFrom) {
            let deleteRes = await global.qb.delete(torrentToObj.url.match(/\/(\w+).torrent/)[1], false)
            if (!deleteRes) return;
        }

        return await torrent.torrentDownload(torrentToObj)
    },
    getTorrentByAid: async (aid) => {
        return await global.db.torrent.getByAid(aid)
    }
}

module.exports = torrent;
