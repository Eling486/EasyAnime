const network = require('./network')
const jwt = require('./jwt')
const request = require('./request')
const rss = require('./rss')
const subgroup = require('./subgroup')
const anime = require('./anime')
const TMDB = require('./TMDB')
const poster = require('./poster')
const torrent = require('./torrent')

const utils = {
    network: network,
    jwt: jwt,
    request: request,
    rss: rss,
    subgroup: subgroup,
    anime: anime,
    TMDB: TMDB,
    poster: poster,
    torrent: torrent
}

module.exports = utils;