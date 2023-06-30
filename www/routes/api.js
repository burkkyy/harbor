/*
 * @file api.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 24, 2023
 *
 * Currently in testing phase
 * 
 * Routes defined for /api
 * This route is responsable for the api of my website
 * 
*/

const auth = require('../lib/auth');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => { res.sendStatus(400); });

router.post('/login', (req, res) => {
    try {
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
});

module.exports = router;
