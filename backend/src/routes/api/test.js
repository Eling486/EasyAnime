const express = require('express');
const router = express.Router();
const { sendJSON } = require('../../response')
const { rss, subgroup, anime, poster, torrent } = require('../../utils')

router.get('/', async function (req, res, next) {
  // TODO: For test

  sendJSON({
    req, res,
    code: 0,
    data: result
  });
  next();
})

router.post('/resetDB', async function (req, res, next) {
  await global.db.reset()
  sendJSON({
    req, res,
    code: 0
  })
  next();
})


module.exports = router;
