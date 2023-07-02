/*
 * @file root.js
 * @author Caleb Burke
 * @version 1.1
 * @date June 24, 2023
 *
 * Routes defined for /
 *
*/

const { get_ticket } = require('../lib/proxmox');
const { render_md, render_html, render_template } = require('../lib/helper');
const express = require('express');

const router = express.Router();

const input_error = true;

router.get('/', render_html('home'));
router.get('/home', (req, res) => { res.redirect('/'); });
router.get('/about', render_md('about'));

router.get('/login', async (req, res) => { res.render('login'); });

router.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        if (username == null || password == null) { res.render('login'); }

        const response = await fetch('http://localhost/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.status === 200) {
            console.log(response.body.proxmox_key);
            ticket = null;
            try {
                ticket = await get_ticket(username, response.body.proxmox_key);
            } catch (e) {
                console.error("Error in /login: ", e);
                if (e === 401) {
                    return res.render('login', { username: username, input_error });
                } else {
                    return res.sendStatus(500);
                }
            }

            res.cookie('PVEAuthCookie=' + ticket);
            res.redirect(302, '/proxmox');
        }

        res.render('login', { username: username, input_error });
    } catch (e) {
        console.error(e);
        res.redirect(302, '/login');
    }
});

router.get('/create_user', (req, res) => {
    res.render('create_user');
});

router.post('/create_user', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const retyped_password = req.body['retype-password'];

    if (password !== retyped_password) {
        let input_error = true;
        return res.render('create_user', {
            username: username,
            password: password,
            input_error
        });
    }

    fetch('http://localhost/api/user/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then(async (response) => {
        const user = await response.json();
        res.status(200).send(user);
    }).catch((e) => {
        res.sendStatus(500);
    });
});

module.exports = router;
