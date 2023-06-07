/*
 * @file root.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 5, 2023
 *
 * Routes defined for /
 *
*/

const express = require('express');
const path = require('path');
const { readFile } = require('fs').promises;

// Module for parsing markdown
const { marked } = require('marked');

// Modules for sanatizing markdown files, to prevent code injection
const create_dom_purifier = require('dompurify');
const { JSDOM } = require('jsdom');

// Create the markdown purifier
const dom_purify = create_dom_purifier(new JSDOM().window);

const router = express.Router();

router.get('/', render_page('home.md'));

router.get('/home', (req, res) => { res.redirect('/'); });

router.get('/about', render_page('about.md'));

router.get('/test', render_page('about.md'));

function render_page(page){
    return async (req, res) => {
        _md = await readFile(
            path.join(__dirname, `../public/pages/${page}`), 'utf-8'
        );

        _html = dom_purify.sanitize(
            marked.parse(_md, { mangle: false, headerIds: false })
        );
        
        res.render('layout', { content: _html });
    }
}

module.exports = router;
