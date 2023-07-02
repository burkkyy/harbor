/*
 * @file museum.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 6, 2023
 *
 * Routes defined for /museum
 *
*/

const { render_md } = require('../lib/helper');
const express = require('express');

const router = express.Router();

router.get('/', render_md('museum'));

module.exports = router;
