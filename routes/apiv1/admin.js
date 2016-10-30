"use strict";

var express = require('express');
var router = express.Router();

var jwtAuth = require('../../lib/jwtAuth');

// json web token auth
router.use(jwtAuth());

router.get('/', function(req, res) {
    res.json({ success: true, text: 'zona de admin'});
});

module.exports = router;
