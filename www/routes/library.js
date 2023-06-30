/*
 * @file library.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 6, 2023
 *
 * Routes defined for /library
 *
*/

const { render_md } = require('../lib/helper');
const express = require('express');

const router = express.Router();

router.get('/', render_md('library'));

module.exports = router;
