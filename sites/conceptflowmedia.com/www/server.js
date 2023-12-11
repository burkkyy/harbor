#!/usr/bin/env node

/*
 * @file server.js
 * @author Caleb Burke
 * @version 1.0
 * @date September 15, 2023
 *
 * Entry point for my nodejs server
 *
*/

// Import statements
const express = require('express');
const path = require('path');

// Start the express app
const app = express();
const PORT = 3000;

// Configure express app
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/home.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
