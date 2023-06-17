/*
 * @file museum.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 6, 2023
 *
 * Routes defined for /museum
 *
*/

const { render_page } = require('./util');

const express = require('express');

const router = express.Router();
router.get('/', render_page('museum.md'));

module.exports = router;
