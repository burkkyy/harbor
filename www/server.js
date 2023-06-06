/*
 * @file server.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 4, 2023
 *
 * Entry point for my nodejs server
 *
*/ 

// Import statements
const express = require('express');
const path = require('path');

// Start the express app
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static(__dirname + '/public/assets'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/pages/home.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/pages/home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/pages/about.html'));
});

app.get('/render', (req, res) => {
    res.render('layout');
});

app.get('/test', (req, res) => {
    res.status(200).send({
        ar: 'a',
        tseet1: 'a32'
    })
});

app.post('/test/:id', (req, res) => {
    const { id } = req.params;
    const { body } = req.body;

    console.log(body);
    res.status(200).send();
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
