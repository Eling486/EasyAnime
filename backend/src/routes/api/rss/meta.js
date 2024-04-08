const express = require('express');
const router = express.Router();
const { sendJSON } = require('../../../response')
const { validate } = require('../../../user')
const { rss } = require('../../../utils')

router.post('/', async function (req, res, next) {
    let loginState = await validate(req)
    if (!loginState.logined) {
        sendJSON({
            req, res,
            code: -50101
        });
        return next();
    }

    if (!loginState.payload.is_admin) {
        sendJSON({
            req, res,
            code: -50102
        });
        return next();
    }

    const RSS_URL = req.body.url
    const RSS_SOURCE = req.body.source

    if(RSS_SOURCE == 'mikan'){
        if(!/https?:\/\/mikanani.me\/RSS\//.test(RSS_URL)){
            sendJSON({
                req, res,
                code: -50301
            });
            return next();
        }
    }
    
    let meta = await rss.parser[RSS_SOURCE].getRSSMeta(RSS_URL)
    let data = await rss.getRSSByUrl(RSS_URL)
    let filter = global.config.config.filter
    let isSubscribe = global.config.config.subscribe
    if(data && data.code == 0) {
        if (data.data.length > 0){
            filter = JSON.parse(data.data[0].filter)
            isSubscribe = Boolean(data.data[0].is_subscribe)
        }
    }

    sendJSON({
        req, res,
        code: 0,
        data: {
            meta,
            filter: filter,
            is_subscribe: isSubscribe
        }
    });
    return next();
})

module.exports = router;