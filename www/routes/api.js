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

const harbor = require('../lib/core');
const log = require('../lib/log');
const db = require('../lib/db');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => { res.sendStatus(400); });

router.post('/user/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = await harbor.auth_user(username, password);
        if (!user) { return res.sendStatus(400); }
        res.sendStatus(200);
    } catch (e) {
        log.error(e);
        res.sendStatus(500);
    }
});

router.post('/user/create', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const create_user_key = req.body.create_user_key;
        const CREATE_USER_KEY = await db.get_env('CREATE_USER_KEY');
        
        if (!username || !password || !create_user_key || !CREATE_USER_KEY) {
            return res.sendStatus(400);
        }

        if (!(await bcrypt.compare(create_user_key, CREATE_USER_KEY))) {
            let input_error = true;
            return res.render('create_user', {
                username: username,
                password: password,
                input_error
            });
        }

        const user = await harbor.create_user(username, password);
        if (!user) {
            log.error('Error while creating user');
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    } catch (e) {
        log.error(e);
        res.sendStatus(500);
    }
});

router.post('/proxmox/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const data = await harbor.proxmox_login(username, password);

        if (data === null) {
            log.warning(`login from user '${username}' failed`);
            res.sendStatus(400);
        } else {
            res.status(200).send({
                ticket: data.ticket,
                CSRFPreventionToken: data.CSRFPreventionToken,
            });
        }
    } catch (e) {
        log.error(e);
        res.sendStatus(500);
    }
});

module.exports = router;
