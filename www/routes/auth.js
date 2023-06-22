/*
 * @file auth.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 20, 2023
 *
 * Currently in testing phase
 * 
 * Routes defined for /auth
 * This route is responsable for user authentication.
 * Note that none of these usernames/passwords do anything and should not do
 * anything. 
*/

const express = require('express');
const router = express.Router();

const users = [
    {
        username: 'Caleb',
        password: 'password123'
    },
    {
        username: 'Micah',
        password: 'micah123'
    },
];

router.get('/', async (req, res) => {
    console.log('Getting proxmox access token...');
    const token_res = await (await fetch('https://calebburke.dev/proxmox/api2/json/access/ticket', {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'username=USERNAMEHERE@pam&password=PASSWORDHERE'
    })).json();
    console.log(token_res.data.username);
    console.log('Redirecting to proxmox...');

    res.cookie('PVEAuthCookie=' + token_res.data.ticket);
    res.redirect(302, '/proxmox');
});

module.exports = router;
