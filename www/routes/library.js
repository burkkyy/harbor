/*
 * @file library.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 6, 2023
 *
 * Routes defined for /library
 *
*/

const { render_page } = require('./util');

const express = require('express');

const router = express.Router();
router.get('/', render_page('library.md'));

module.exports = router;
