const request = require('../request')
const xpath = require('xpath')
const DOMParser = require('xmldom').DOMParser
const { JSDOM } = require("jsdom")

const mikan = {
    SOURCE: 'mikan',
    getRSS: async (RSSUrl) => {
        data = await request('GET', RSSUrl).catch((err) => {
            global.logger.error(err)
        })
        if (!data || data.status !== 200) {
            return null
        }
        let rssData = new DOMParser().parseFromString(data.data, 'text/xml')
        return rssData
    },
    verifyRSS: (rssData) => {
        if (!rssData) {
            return false
        }
        if (xpath.select("rss", rssData).length == 0) {
            return false
        }
        return true
    },
    getRSSMeta: async (rssData) => {
        if (typeof rssData == 'string') {
            rssData = await mikan.getRSS(rssData)
        }
        let rssTitle = xpath.select("string(//rss/channel/title)", rssData)
        let name = rssTitle.split(' - ')[1]
        if (!name) name = rssTitle;
        let season = 1
        let seasonListCN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
        let result = name.match(/第(.)季/)
        if (result) {
            let floatResult = parseFloat(result[1])
            if (!isNaN(floatResult)) {
                season = floatResult
            }
            if (seasonListCN.indexOf(result[1]) >= 0) {
                season = seasonListCN.indexOf(result[1])
            }
            name = name.replace(/第.季/g, '')
        }
        name = name.trimEnd()
        let rssUrl = xpath.select("string(//rss/channel/link)", rssData)
        let rssItem = xpath.select("//rss/channel/item", rssData)
        let bangumiId = rssUrl.match(/bangumiId=(\d+)/g)
        if (bangumiId) bangumiId = parseInt(bangumiId[0].split('=')[1])
        let subgroupId = rssUrl.match(/subgroupid=(\d+)/g)
        if (subgroupId) subgroupId = parseInt(subgroupId[0].split('=')[1])
        rssMeta = {
            type: 'anime',
            source_meta: {}
        }
        if (bangumiId) {
            rssMeta['season'] = season
            rssMeta.source_meta['bangumi_id'] = bangumiId
            if (subgroupId) {
                rssMeta.source_meta['subgroup_id'] = subgroupId
            }
        }
        if (!bangumiId && subgroupId) {
            rssMeta.type = 'subgroup'
            rssMeta.source_meta['subgroup_id'] = subgroupId
        }
        if (!bangumiId && !subgroupId) {
            rssMeta.type = 'other'
        }

        return {
            title: rssTitle,
            name: name,
            url: rssUrl,
            source: mikan.SOURCE,
            rss_meta: rssMeta,
            itemNum: rssItem.length
        }
    },
    getPoster: async (bangumiId) => {
        let url = `https://mikanani.me/Home/Bangumi/${bangumiId}`

        let data = await request('GET', url).catch((err) => {
            global.logger.error(err)
        })
        if (!data || data.status !== 200) {
            return null
        }
        const dom = new JSDOM(data.data)
        let imgData = dom.window.document.querySelector(".bangumi-poster")
        if (!imgData) return null;
        imgData = imgData.style.backgroundImage
        imgData = imgData.replace(/url\((.*)\)/, '$1')
        let imgUrl = `https://mikanani.me${imgData.split('?')[0]}`
        return imgUrl
    },
    getAnimeByHomepage: async (url) => {
        let data = await request('GET', url).catch((err) => {
            global.logger.error(err)
        })
        if (!data || data.status !== 200) {
            return null
        }
        const dom = new JSDOM(data.data)
        let name = null, rssUrl = null, bangumiId = null, subgroupId = null, season = null
        let nameDOM = dom.window.document.querySelector(".bangumi-title .w-other-c")
        if (nameDOM) name = Buffer.from(nameDOM.innerHTML, 'utf8').toString();
        let rssDOM = dom.window.document.querySelector(".bangumi-title .mikan-rss")
        if (rssDOM) rssUrl = `https://mikanani.me${rssDOM.href}`
        if (rssUrl) {
            bangumiId = rssUrl.match(/bangumiId=(\d+)/g)
            if (bangumiId) bangumiId = parseInt(bangumiId[0].split('=')[1])
            subgroupId = rssUrl.match(/subgroupid=(\d+)/g)
            if (subgroupId) subgroupId = parseInt(subgroupId[0].split('=')[1])
        }
        if (name) {
            let seasonListCN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
            let seasonResult = name.match(/第(.)季/)
            if (seasonResult) {
                let floatResult = parseFloat(seasonResult[1])
                if (!isNaN(floatResult)) {
                    season = floatResult
                }
                if (seasonListCN.indexOf(seasonResult[1]) >= 0) {
                    season = seasonListCN.indexOf(seasonResult[1])
                }
                name = name.replace(/第.季/g, '')
                name = name.trimEnd()
            }
        }
        return {
            name: name,
            season: season,
            rssUrl: rssUrl,
            bangumiId: bangumiId,
            subgroupId: subgroupId
        }
    }
}

module.exports = mikan;