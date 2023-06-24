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

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => { res.sendStatus(400); });

router.post('/login', (req, res) => {
    try {
        const username = encodeURIComponent(req.body.username);
        const password = encodeURIComponent(req.body.password);
        console.log(`username: ${username}\npassword: ${password}`);
        res.status(200).send('OK');
    } catch (e) {
        res.status(500).send('An error has occered');
    }
});

module.exports = router;
