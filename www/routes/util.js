/*
 * @file util.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 15, 2023
 *
 * Helper functions for routes
 *
*/

const { readFile } = require('fs').promises;
const path = require('path');

// Module for parsing markdown
const { marked } = require('marked');

// Modules for sanatizing markdown files, to prevent code injection
const create_dom_purifier = require('dompurify');
const { JSDOM } = require('jsdom');

// Create the markdown purifier
const dom_purify = create_dom_purifier(new JSDOM().window);


function render_page(page) {
    return async (req, res, next) => {
        try {
            _md = await readFile(
                path.join(__dirname, `../public/pages/${page}`), 'utf-8'
            );

            _html = dom_purify.sanitize(
                marked.parse(_md, { mangle: false, headerIds: false })
            );

            res.render('layout', { content: _html });
            next();
        } catch (err) {
            console.log(err);
            res.status(500).send('Some server side error has occored');
        }
    }
}

module.exports = { render_page };
