/*
 * @file auth.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 30, 2023
 *
 * Functions for interfacing with the mongodb database
 * 
*/

const {
    randomBytes,
    createHash,
    createCipheriv,
    createDecipheriv
} = require('crypto');
const bcrypt = require('bcrypt');
const base85 = require('base85');

async function create_user(username, password) {
    if (username == null || password == null) {
        throw new Error('Null username or password');
    }

    // Generate a random secure password for the new proxmox user
    const proxmox_pwd = base85.encode(randomBytes(52)).slice(0, 64);

    // Hash the password to get the key
    const key = createHash('sha256').update(password).digest('hex');

    // Use a random iv and the key for the cipher 
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);

    // Encrypt the proxmox password and hash the key, 
    // to store on the database
    let encrypted = cipher.update(proxmox_pwd, 'utf-8', 'hex') + cipher.final('hex');
    let hkey = await bcrypt.hash(key, 10);

    const user = {
        username: username,
        key: hkey,
        iv: iv.toString('hex'),
        proxmox_key: encrypted,
    };

    return user;
}

async function auth_user(user, password) {
    console.log(user, password)
    // Get the key from the user
    const key = createHash('sha256').update(password).digest();

    if (!await bcrypt.compare(key.toString('hex'), user.key)) {
        console.log('Invalid password');
        return false;
    }

    const decipher = createDecipheriv(
        'aes-256-cbc',
        key,
        Buffer.from(user.iv, 'hex')
    );
    try {
        let proxmox_key = decipher.update(user.proxmox_key, 'hex', 'utf-8');
        proxmox_key += decipher.final('utf-8');
        console.log(proxmox_key);
    } catch (e) {
        console.log('Error decrypting proxmox password');
        return false;
    }
    return true;
}

module.exports = { create_user, auth_user };
