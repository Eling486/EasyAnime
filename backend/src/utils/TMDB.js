const request = require('./request');

const TMDB = {
    search: async (keyword) => {
        let key = global.config.config.TMDB_key
        let lang = 'zh'
        let url = `https://api.themoviedb.org/3/search/multi?query=${keyword}&include_adult=false&language=${lang}&page=1&api_key=${key}`
        let data = await request('GET', url, null, {
            accept: 'application/json',
            Authorization: `Bearer ${key}`
        }).catch((err) => {
            global.logger.error(err)
        })
        if(!data) return
        return data.data
    }
}

module.exports = TMDB;
