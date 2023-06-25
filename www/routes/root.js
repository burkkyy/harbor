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
const { render_page } = require('./util');
const express = require('express');

const router = express.Router();

router.get('/', render_page('home.md'));
router.get('/home', (req, res) => { res.redirect('/'); });
router.get('/about', render_page('about.md'));

router.get('/login', async (req, res) => { res.render('login'); });

router.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        
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
        res.redirect(302, '/auth/login');
    }
});

module.exports = router;
