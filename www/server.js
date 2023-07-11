#!/usr/bin/env node

/*
 * @file server.js
 * @author Caleb Burke
 * @version 1.1
 * @date June 4, 2023
 *
 * Entry point for my nodejs server
 *
*/

// Aliases
require('module-alias/register');

// Import statements
const express = require('express');

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
const api_router = require('./routes/api');
const museum_router = require('./routes/museum');
const library_router = require('./routes/library');
const article_router = require('./routes/articles');

// Add the routers to middleware
app.use('/', root_router);
app.use('/api', api_router);
app.use('/museum', museum_router);
app.use('/library', library_router);
app.use('/articles', article_router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
