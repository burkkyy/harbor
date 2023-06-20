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

require('dotenv').config();

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

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

router.get('/', auth_token, (req, res) => {
    res.sendStatus(200);
});

router.get('/users', auth_token, (req, res) => {
    res.send(users);
});

router.get('/go', (req, res) => {
    const user = {
        username: "caleb",
        password: "caleb"
    }
    token = create_token(user);
    if (token == null) { res.sendStatus(500); }
    res.cookie('authorization', token);
    res.redirect('/proxmox');
});

router.post('/login', (req, res) => {
    // TODO: Auth user login from data base data
    const username = req.body.username;
    const password = req.body.password;

    if (username == null || password == null) {
        res.sendStatus(401);
    }

    const user = {
        username: username,
        password: password
    }
    token = create_token(user);
    if (token) { res.send(token); }
    res.sendStatus(500);
});

// Helper functions

function create_token(user) {
    try {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        return token;
    } catch (e) {
        console.error(e);
        return null;
    }
}

// Middleware functions

function auth_token(req, res, next) {
    console.log('1');
    const auth_header = req.headers['cookie'];
    const token = auth_header && auth_header.split('=')[1];

    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, usr) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = usr;
        next();
    });
}

module.exports = router;
