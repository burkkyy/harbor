/*
 * @file articles.js
 * @author Caleb Burke
 * @version 1.0
 * @date July 8, 2023
 *
 * Routes defined for /articles
 *
*/


const express = require('express');
const path = require('path');

const router = express.Router();

router.use(express.static(path.join(__dirname, '..', 'client', 'build')));

router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

module.exports = router;
