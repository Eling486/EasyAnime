const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')
const { sendJSON } = require('../../../response')
const { validate } = require('../../../user')
const { rss, anime, torrent } = require('../../../utils')

router.get('/', async function (req, res, next) {
    let loginState = await validate(req)
    if (!loginState.logined) {
        sendJSON({
            req, res,
            code: -50101
        });
        return next();
    }

    let resAnime = await anime.getAnimeByAid()
    if(resAnime.code < 0){
        sendJSON({
            req, res,
            code: -500
        });
        return next();
    }

    let resSubscribed = await rss.getSubscribed()
    if(resSubscribed.code < 0){
        sendJSON({
            req, res,
            code: -500
        });
        return next();
    }

    let resNewToday = await torrent.getToday()
    if(resNewToday.code < 0){
        sendJSON({
            req, res,
            code: -500
        });
        return next();
    }

    sendJSON({
        req, res,
        code: 0,
        data: {
            subscribedRSS: resSubscribed.data,
            animeList: resAnime.data,
            new: {
                today: resNewToday.data
            }
        }
    });
    return next();
})

module.exports = router;