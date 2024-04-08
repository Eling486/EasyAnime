const TMDB = require('./TMDB')
const rss = require('./rss')
const poster = require('./poster')

const anime = {
    addAnimeByRID: async (rid, data) => {
        let rssData = await global.db.search(`SELECT * FROM rss WHERE rid = ?`, rid)
        if (rssData.code < 0) return -1;
        if (rssData.data.length == 0) return -1;
        //let result = await TMDB.search(rssData.data[0].name)
        let rssObj = rssData.data[0]
        let rssMeta = JSON.parse(rssObj.meta)
        let bangumiId = rssMeta.source_meta['bangumi_id']

        data['title'] = rssObj.name
        data['season'] = rssMeta.season
        data['source'] = rssObj.source
        data['bangumiId'] = bangumiId
        let aid = await anime.addAnime(data)
        return aid
    },
    addAnimeByData: async (data) => {
        // title, season, source, filter, is_subscribe,  bangumiId?
        data['save_path'] = global.config.config.save_path
        let aid = await anime.addAnime(data)
        return aid
    },
    addAnime: async (data) => {
        let imgUrl = null
        let imgPath = null
        if(data.bangumiId){
            meta_db = 'mikan'
            meta_id = data.bangumiId
            imgUrl = await rss.parser[data.source].getPoster(data.bangumiId)
            imgPath = await poster.downloadPoster(imgUrl).catch((err)=> {
                imgPath = null
            })
        }
        let AnimeData = {
            title: data.title,
            meta_db: null,
            meta_id: null,
            meta_update_time: null,
            meta_title: null,
            season: data.season,
            source: data.source,
            filter: data.filter,
            poster_url: imgUrl,
            poster_path: imgPath,
            save_path: data.save_path,
            is_subscribe: data.is_subscribe
        }
        let aid = await global.db.anime.add(AnimeData)
        return aid
    },
    refreshPoster: async (aid) => {
        let AnimeData = await global.db.anime.get(aid)
        let imgUrl = null
        let imgPath = null
        if(AnimeData.data[0].meta_db){
            imgUrl = await rss.parser[AnimeData.data[0].meta_db].getPoster(AnimeData.data[0].meta_id)
            if(!imgUrl) imgUrl = AnimeData.data[0].poster_url
            imgPath = await poster.downloadPoster(imgUrl).catch((err)=> {
                imgPath = null
            })
            return await global.db.anime.updatePoster(aid, imgUrl, imgPath)
        }
        if(AnimeData.data[0].poster_url){
            imgUrl = AnimeData.data[0].poster_url
            imgPath = await poster.downloadPoster(imgUrl).catch((err)=> {
                imgPath = null
            })
            return await global.db.anime.updatePoster(aid, imgUrl, imgPath)
        }
        return null
    },
    getAnimeByAid: async (aid = null) => {
        return await global.db.anime.get(aid)
    },
    getAnimeByTitle: async (title = null) => {
        return await global.db.anime.getByTitle(title)
    }
}

module.exports = anime;