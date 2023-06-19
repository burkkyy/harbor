/*
 * @file root.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 5, 2023
 *
 * Routes defined for /
 *
*/

const { render_page } = require('./util');

const express = require('express');

const router = express.Router();
router.get('/', render_page('home.md'));
router.get('/home', (req, res) => { res.redirect('/'); });
router.get('/about', render_page('about.md'));
router.get('/test', render_page('about.md'));

module.exports = router;
