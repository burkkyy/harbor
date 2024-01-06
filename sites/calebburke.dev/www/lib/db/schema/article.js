/*
 * @file article.js
 * @author Caleb Burke
 * @version 1.0
 * @date July 8, 2023
 *
 * Schema for creating and modifing articles
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
        required: false,
    }],
    description: {
        type: String,
        required: false,
    },
    markdown: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: () => { Date.now },
        immutable: true,
    }
});

module.exports = article_schema;
