const express = require('express');
const router = express.Router();
const { sendJSON } = require('../../../../response')
const { validate } = require('../../../../user')
const { rss } = require('../../../../utils')

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

    let data = await rss.updateSubscribe({
        rid: req.body.rid,
        is_subscribe: req.body.is_subscribe
    })

    if (data == -1) {
        sendJSON({
            req, res,
            code: -500
        });
        return next();
    }

    sendJSON({
        req, res,
        code: 0
    });
    return next();
})

module.exports = router;