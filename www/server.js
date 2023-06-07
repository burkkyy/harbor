#!/usr/bin/env node

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
const PORT = 3000;

// Configure express app
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Set up the routers
const root_router = require('./routes/root');
const museum_router = require('./routes/museum');
const library_router = require('./routes/library');

// Add the routers to middleware
app.use('/', root_router);
app.use('/museum', museum_router);
app.use('/library', library_router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
