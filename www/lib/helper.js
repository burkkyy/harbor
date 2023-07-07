/*
 * @file helper.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 26, 2023
 *
 * Miscellaneous helper functions that dont yet deserve their own file
 * 
*/

const { readFile } = require('fs').promises;
const path = require('path');
const { marked } = require('marked'); // Parsing markdown
const create_dom_purifier = require('dompurify'); // Sanatizing markdown files
const { JSDOM } = require('jsdom');

// Enviroment variables
const PATH = '../public/'; // All files that go to client must be from public

/**
 * Renders html file in a blank html
 * @param {string} filename 
 * @returns 
 * @note Middleware
 * @note CSS styles are provided
 */
function render_template(filename){
    return async (req, res, next) => {
        try { 
            let subdir = 'html/'
            let prefix = '.html';

            let _html = await readFile(
                path.join(__dirname, PATH + subdir + filename + prefix), 'utf-8'
            );
            
            res.render('template', { content: _html });
            next();
        } catch(e){
            console.log(e);
            res.status(500).send('Some server side error has occored');
        }
    }
}

/**
 * Renders html file under a layout
 * @param {string} filename 
 * @returns 
 * @note Middleware
 */
function render_html(filename){
    return async (req, res, next) => {
        try {
            let subdir = 'html/'
            let prefix = '.html';

            let _html = await readFile(
                path.join(__dirname, PATH + subdir + filename + prefix), 'utf-8'
            );

            res.render('layout', { content: _html });
            next();
        } catch (err) {
            console.log(err);
            res.status(500).send('Some server side error has occored');
        }
    }
}

/**
 * Renders markdown file as html file
 * @param {string} filename
 * @returns
 * @note Middleware 
 */
function render_md(filename) {
    const dom_purify = create_dom_purifier(new JSDOM().window);
    return async (req, res, next) => {
        try {
            let subdir = 'docs/'
            let prefix = '.md';

            let _md = await readFile(
                path.join(__dirname, PATH + subdir + filename + prefix), 'utf-8'
            );

            let _html = dom_purify.sanitize(
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

module.exports = {
    render_template,
    render_html,
    render_md
}
