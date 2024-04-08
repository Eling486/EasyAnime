const express = require('express');
const router = express.Router();
const { sendJSON } = require('../../../response')
const { validate } = require('../../../user')
const { anime } = require('../../../utils')

router.get('/', async function (req, res, next) {
    let loginState = await validate(req)
    if (!loginState.logined) {
        sendJSON({
            req, res,
            code: -50101
        });
        return next();
    }

    let result = await anime.getAnimeByAid()

    if (result.code < 0) {
        sendJSON({
            req, res,
            code: -500
        });
        return next();
    }

    sendJSON({
        req, res,
        code: 0,
        data: result.data
    });
    return next();
})

module.exports = router;