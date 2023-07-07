/*
 * @file root.js
 * @author Caleb Burke
 * @version 1.1
 * @date June 24, 2023
 *
 * Routes defined for /
 *
*/

const { render_md, render_html, render_template } = require('../lib/helper');
const log = require('../lib/log');
const express = require('express');

const router = express.Router();
const input_error = true; // Used for ejs magic

router.get('/', render_html('home'));
router.get('/home', (req, res) => { res.redirect('/'); });
router.get('/about', render_md('about'));

router.get('/login', async (req, res) => { res.render('login'); });

router.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        if (username == null || password == null) { res.render('login'); }

        const response = await fetch('http://localhost/api/proxmox/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (!response.ok) {
            return res.render('login', { username: username, input_error });
        }

        log.info(`User just logged in: ${username}`);

        let ticket = (await response.json()).ticket;
        res.cookie('PVEAuthCookie=' + ticket);
        res.redirect(302, '/proxmox');
    } catch (e) {
        log.error(e);
        res.redirect(302, '/login');
    }
});

router.get('/create_user', (req, res) => {
    res.render('create_user');
});

router.post('/create_user', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const retyped_password = req.body['retype-password'];
        const create_user_key = req.body.create_user_key;

        if (password !== retyped_password) {
            let input_error = true;
            return res.render('create_user', {
                username: username,
                password: password,
                input_error
            });
        }

        const resposne = await fetch('http://localhost/api/user/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                create_user_key: create_user_key
            })
        });

        if (resposne.ok) {
            log.info(`Created new user ${username}`);
            res.sendStatus(200);
        } else {
            log.error('Could not create user');
            res.sendStatus(500);
        }
    } catch (e) {
        log.error(e);
        res.render('create_user');
    }
});

module.exports = router;
