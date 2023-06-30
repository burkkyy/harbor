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

router.get('/', render_html('home'));
router.get('/home', (req, res) => { res.redirect('/'); });
router.get('/about', render_md('about'));

router.get('/login', async (req, res) => { res.render('login'); });

router.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        
        // Auth user
        const response = await fetch('http://localhost/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        ticket = null;
        try {
            ticket = await get_ticket(username, password);
        } catch (e) {
            console.error("Error in /login: ", e);
            if (e === 401) {
                input_error = true;
                return res.render('login', { username: username, input_error });
            } else {
                return res.sendStatus(500);
            }
        }

        res.cookie('PVEAuthCookie=' + ticket);
        res.redirect(302, '/proxmox');
    } catch (e) {
        console.error(e);
        res.redirect(302, '/login');
    }
});

router.get('/create_user', render_template('create-user'));

router.post('/create_user', (req, res) => {
    res.sendStatus(200);
});

module.exports = router;
