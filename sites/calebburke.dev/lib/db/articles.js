/*
 * @file articles.js
 * @author Caleb Burke
 * @version 1.3
 * @date July 6, 2023
 *
 * Functions for interfacing with the articles in the mongodb database.
 * 
 * NOTE: Change 'uri' to the address of the mongodb server. This address
 *       will probably not work for you
*/

require('dotenv').config({ path: '../.env' }); // ONLY USE IN DEV!

const mongoose = require('mongoose');
const log = require('../log');
const ArticleSchema = require('./schema/article');

const uri = 'mongodb://192.168.1.222';
const dbs = 'articles'
mongoose.connect(uri + dbs);

/**
 * Puts blog post on database
 * @async
 * @param {string} subject The mongodb collection the blog will be posted to
 * @param {string} title The title of the blog post
 * @param {string[]} authors The writers and contributors of the post
 * @param {string} description A brief of the blog
 * @param {string} markdown The text of the blog, written in markdown
 * @return {boolean} If the blog was posted
 */
async function post_article(subject, title, authors, description, markdown){
    const Article = mongoose.model(subject, ArticleSchema, subject);
    await Article.create({
        title: title,
        authors: authors,
        description: description,
        markdown: markdown
    });
}

module.exports = {};
