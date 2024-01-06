/*
 * @file user.js
 * @author Caleb Burke
 * @version 1.0
 * @date July 8, 2023
 *
 * Schema and model defined for users.
 * 
 * NOTE: This is currently unused
 * 
*/

const mongoose = require('mongoose');

const user_schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    auth: {
        key: {
            type: String,
            required: true,
        },
        iv: {
            type: String,
            required: true,
        },
        proxmox_key: {
            type: String,
            required: true,
        },
    },
    created_at: {
        type: Date,
        default: () => { Date.now },
        immutable: true,
    }
});

module.exports = mongoose.model('users', user_schema);
