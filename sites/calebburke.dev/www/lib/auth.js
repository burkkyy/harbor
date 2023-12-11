/*
 * @file auth.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 30, 2023
 *
 * Functions for authenticating/creating/deleting users
 * 
*/

const {
    randomBytes,
    createHash,
    createCipheriv,
    createDecipheriv
} = require('crypto');
const bcrypt = require('bcrypt');
const log = require('./log');

/**
 * Creates user object for database storage
 * @async
 * @param {string} username 
 * @param {string} password 
 * @returns {object} user created
 * @note user not created on any server, just creates the user object
 */
async function create_user(username, password, proxmox_password) {
    try {
        const key = createHash('sha256').update(password).digest('hex');
        const iv = randomBytes(16);
        const encrypted_key = encrypt_proxmox_key(key, iv, proxmox_password);
        return {
            username: username,
            key: await bcrypt.hash(key, 10),
            iv: iv.toString('hex'),
            proxmox_key: encrypted_key,
        };
    } catch (e) {
        log.error(e);
        return null;
    }
}

/**
 * Authenticates user
 * @async
 * @param {object} user - user object from database
 * @param {string} password
 * @returns {boolean} if user is valid (authenticated)
 */
async function auth_user(user, password) {
    try {
        const key = createHash('sha256').update(password).digest();
        return await bcrypt.compare(key.toString('hex'), user.key);
    } catch (e) {
        log.error(e);
        return false;
    }
}

/**
 * Encrypts a proxmox key with given parameters
 * @param {string} key - 32 byte key
 * @param {object} iv - 16 byte array
 * @param {string} proxmox_password - string to be encrypted
 * @returns {string} encrypted proxmox password
 */
function encrypt_proxmox_key(key, iv, proxmox_password) {
    try {
        const cipher = createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        return cipher.update(proxmox_password, 'utf-8', 'hex') + cipher.final('hex');
    } catch (e) {
        log.error(e);
        return null;
    }
}

/**
 * Decrypts proxmox key
 * @param {object} user - user object from database 
 * @param {string} password - password that was used for encrypting proxmox password
 * @returns {object} the proxmox password
 * @note returns null if decryption error
 */
function decrypt_proxmox_key(user, password) {
    try {
        const decipher = createDecipheriv(
            'aes-256-cbc',
            createHash('sha256').update(password).digest(),
            Buffer.from(user.iv, 'hex')
        );
        return decipher.update(user.proxmox_key, 'hex', 'utf-8') + decipher.final('utf-8');
    } catch (e) {
        log.info('Error decrypting proxmox password');
        return null;
    }
}

module.exports = {
    create_user,
    auth_user,
    decrypt_proxmox_key,
};
