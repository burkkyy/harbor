/*
 * @file museum.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 6, 2023
 *
 * Routes defined for /museum
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

// Create the markdown purifier
const dom_purify = create_dom_purifier(new JSDOM().window);

router.get('/', (req, res) => {
    res.send('Museum');
});

router.get('/', async (req, res) => {
    md_text = await readFile(
        path.join(__dirname, '../public/pages/museum.md'),
        'utf-8'
    );

    html_text = marked.parse(md_text, { mangle: false, headerIds: false });

    res.render('layout', { content: html_text });
});

module.exports = router;
