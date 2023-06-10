/*
 * @file library.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 6, 2023
 *
 * Routes defined for /library
 *
*/ 

const express = require('express');
const router = express.Router();

// Modules for handling files
const path = require('path');
const { readFile } = require('fs').promises;

// Module for parsing markdown
const { marked } = require('marked');

// Modules for sanatizing markdown files, to prevent code injection
const create_dom_purifier = require('dompurify');
const { JSDOM } = require('jsdom');

// Defined routes start here
router.get('/', (req, res) => {
    res.send('Library');
});

module.exports = router;
