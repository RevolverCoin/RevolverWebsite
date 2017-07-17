var express = require('express');
var config = require('../config');

var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('slack-invite', { community: config.community,
      tokenRequired: !!config.inviteToken });
});

module.exports = router;