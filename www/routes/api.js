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

const db = require('../lib/db');
const auth = require('../lib/auth');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => { res.sendStatus(400); });

router.post('/user/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        let user = await db.get_user(username);
        if (user == null) {
            res.sendStatus(400);
            return;
        }

        let access = await auth.auth_user(user, password);
        if (!access) {
            res.sendStatus(403);
            return;
        }
        
        res.status(200).send({
            proxmox_key: 'a',
        });
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post('/user/create', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(username == null || password == null){ return res.sendStatus(400); }

    const user = await auth.create_user(username, password);
    res.status(200).send(user);
});

module.exports = router;
