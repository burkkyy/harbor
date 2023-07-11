/*
 * @file article.js
 * @author Caleb Burke
 * @version 1.0
 * @date July 8, 2023
 *
 * Schema and model defined for creating and modifing articles
 * 
*/

const mongoose = require('mongoose');

const article_schema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    authors: [{
        type: String,
    }],
    description: {
        type: String,
    },
});

module.exports = mongoose.model('articles', article_schema);
