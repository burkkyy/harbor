/*
 * @file core.js
 * @author Caleb Burke
 * @version 1.1
 * @date July 6, 2023
 *
 * Core functionality of backend
 * 
*/

const { randomBytes } = require('crypto');
const base85 = require('base85');
const proxmox = require('./proxmox');
const auth = require('./auth');
const log = require('./log');
const db = require('@db');

/**
 * Creates user on proxmox and database
 * @async
 * @param {string} username 
 * @param {string} password 
 * @returns {boolean} if user was created
 * @note user not created on any server, just creates the user object
 */
async function create_user(username, password) {
    try {
        const proxmox_password = base85.encode(randomBytes(52)).slice(0, 64);
        const user = await auth.create_user(username, password, proxmox_password);

        // Create the user on proxmox server
        if (!(await proxmox.create_user_space(username, proxmox_password))) {
            log.error('Proxmox fault');
            return false;
        }

        // Add the user to database
        if (!(await db.add_user(user))) {
            log.error('Database fault');
            return false;
        }

        return true;
    } catch (e) {
        log.error(e);
        return false;
    }
}

/**
 * Authenticates user
 * @async
 * @param {object} username
 * @param {string} password
 * @returns {boolean} if user is valid (authenticated)
 */
async function auth_user(username, password) {
    const user = await db.get_user(username); // Get the user of the database

    if (user === null) {
        log.warning(`Invalid username ${username} provided`);
        return false;
    }

    return auth.auth_user(user, password);
}

/**
 * Logins in to proxmox server
 * @param {string} username 
 * @param {string} password 
 * @returns {object} json with pve ticket and csrf token
 * @note returns null on error
 */
async function proxmox_login(username, password) {
    try {
        const user = await db.get_user(username);
        if (!(await auth.auth_user(user, password))) { return null; }
        const key = auth.decrypt_proxmox_key(user, password);
        return await proxmox.get_ticket(username, key);
    } catch (e) {
        log.error(e);
        return null;
    }
}

module.exports = {
    create_user,
    auth_user,
    proxmox_login,
};
