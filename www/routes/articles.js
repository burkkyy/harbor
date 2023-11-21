/*
 * @file articles.js
 * @author Caleb Burke
 * @version 1.1
 * @date July 25, 2023
 *
 * Routes defined for /articles
 *
*/

const express = require('express');
const fs = require('fs').promises;
const { marked } = require('marked'); // Parsing markdown

const router = express.Router({ strict: true });
router.use(express.static('public', { strict: true }));

router.get('/', async (req, res) => {
    const data = await fs.readdir(`./articles`, { withFileTypes: true })
        .catch(() => {
            return res.sendStatus(500);
        });

    const dirs = data
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

    const files = data
        .filter((d) => !d.isDirectory() && d.name.endsWith('.md'))
        .map((d) => d.name);

    let html = await fs.readFile(__dirname + '//../public/html/article_hub.html', 'utf-8');
    res.render('articles', {
        content: html,
        styles: ['filehub.css'],
        scripts: ['filesystem.js'],
        dirs: dirs,
        files: files,
    });
});

router.get(/\.md$/, async (req, res) => {
    let filename = decodeURIComponent(req.path);
    let path = __dirname + '//../articles' + filename;

    fs.readFile(path, 'utf-8').then((data) => {
        let text = marked.parse(data, { mangle: false, headerIds: false });
        res.render('markdown_layout', { content: text });
    }).catch((err) => {
        res.sendStatus(500);
    });
});

router.get('/*', async (req, res) => {
    try {
        const r = decodeURIComponent(req.path);
        const data = await fs.readdir(`./articles${r}`, { withFileTypes: true })
        const dirs = data
            .filter((d) => d.isDirectory())
            .map((d) => d.name);
        const files = data
            .filter((d) => !d.isDirectory() && d.name.endsWith('.md'))
            .map((d) => d.name);

        let html = await fs.readFile(__dirname + '//../public/html/article_hub.html', 'utf-8');

        res.render('articles', {
            content: html,
            styles: ['filehub.css'],
            scripts: ['filesystem.js'],
            dirs: dirs,
            files: files,
        });
    } catch (e) {
        return res.sendStatus(500);
    }
});

module.exports = router;
