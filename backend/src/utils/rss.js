const parserMikan = require('./parser/mikan')
const request = require('./request')
const xpath = require('xpath')
const DOMParser = require('xmldom').DOMParser
const subgroup = require('./subgroup')

const rss = {
    parser: {
        mikan: parserMikan
    },
    getRSS: async (rid = null) => {
        return await global.db.rss.get(rid)
    },
    getRSSByUrl: async (url) => {
        return await global.db.rss.getByUrl(url)
    },
    getSubscribed: async () => {
        return await global.db.rss.getSubscribed()
    },
    addRSS: async (data) => {
        return await global.db.rss.add(data)
    },
    updateSubscribe: async (data) => {
        return await global.db.rss.updateSubscribe(data.rid, data.is_subscribe)
    },
    scanRSS: async (rid = null) => {
        let rssList = await rss.getRSS(rid)
        if (rssList.code < 0) {
            return []
        }
        if (rssList.data.length == 0) {
            return []
        }
        let rssDataList = []
        for (let i = 0; i < rssList.data.length; i++) {
            let rssObj = rssList.data[i]
            rssObj.items = []
            let data = await request('GET', rssObj.url).catch((err) => {
                global.logger.error(err)
            })
            if (!data || data.status !== 200) {
                rssDataList.push(rssObj)
                continue
            }

            let rssData = new DOMParser().parseFromString(data.data, 'text/xml')
            let rssItemList = xpath.select("//rss[local-name()='rss']/channel/item", rssData)
            for (let j = 0; j < rssItemList.length; j++) {
                let rssItem = rssItemList[j]
                let guid = xpath.select("string(./guid)", rssItem)
                let homepage = xpath.select("string(./link)", rssItem)
                let title = xpath.select("string(./title)", rssItem)
                let description = xpath.select("string(./description)", rssItem)
                let torrent = {
                    content_length: parseInt(xpath.select("string(./enclosure/@length)", rssItem)),
                    pub_date: xpath.select("string(./*[local-name()='torrent']/*[local-name()='pubDate'])", rssItem),
                    url: xpath.select("string(./enclosure/@url)", rssItem)
                }
                let meta = subgroup.format(title)
                rssObj.items.push({
                    guid,
                    homepage,
                    title,
                    description,
                    torrent,
                    meta
                })
            }
            rssDataList.push(rssObj)
            continue
        }
        return rssDataList
    },
    delete: async (rid) => {
        return await global.db.rss.delete(rid)
    }
}

module.exports = rss;