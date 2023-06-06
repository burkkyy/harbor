/*
 * @file root.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 5, 2023
 *
 * Routes defined for /
 *
*/ 

const path = require('path');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    //res.render('layout');
    //res.send('hello');
    
    res.sendFile(path.join(__dirname, '../public/pages/home.html'));
});

router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/home.html'));
});

router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/about.html'));
});

router.get('/render', (req, res) => {
    res.render('layout', { body: "This is the body"});
});

router.get('/test', (req, res) => {
    res.status(200).send({
        ar: 'a',
        tseet1: 'a32'
    })
});

router.post('/test/:id', (req, res) => {
    const { id } = req.params;
    const { body } = req.body;

    console.log(body);
    res.status(200).send();
});

module.exports = router;
