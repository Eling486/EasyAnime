const express = require('express');
const router = express.Router();
const { sendJSON } = require('../../../response')
const { update, validate } = require('../../../user')

router.post('/', async function (req, res, next) {
  let loginState = await validate(req)
  if (!loginState.logined) {
    sendJSON({
      req, res,
      code: -50101
    });
    return next();
  }

  if (!loginState.payload.is_admin && req.body.admin) {
    sendJSON({
      req, res,
      code: -50102
    });
    return next();
  }

  if (!loginState.payload.is_admin && loginState.payload.username !== req.body.username) {
    sendJSON({
      req, res,
      code: -50102
    });
    return next();
  }

  let result = await update(req.body.username, req.body.password, req.body.admin)
  
  if (result.code < 0) {
    sendJSON({
      req, res,
      code: result.code,
    });
    return next();
  }
  sendJSON({
    req, res,
    code: 0,
  });
  return next();
});


module.exports = router;
