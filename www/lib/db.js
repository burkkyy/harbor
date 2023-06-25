/*
 * @file db.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 24, 2023
 *
 * Functions for interfacing with the mongodb database
 * 
*/

require('dotenv').config();

const bcrypt = require('bcrypt');
const base85 = require('base85');
const { randomBytes, createHash, createCipheriv, createDecipheriv } = require('crypto');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://192.168.1.222';
const client = new MongoClient(uri);

async function users() {
    try {
        await client.connect();
        const db = client.db('harbor');
        const collection = db.collection('users');
        users = await collection.find({}).toArray();
        console.log(users);
    } catch (e) {
        console.error(e);
    }
}

async function add_user(username, password) {
    try {
        // Generate a random secure password for the new proxmox user
        const proxmox_pwd = base85.encode(randomBytes(128));

        // Hash the password to get the key
        const key = createHash('sha256').update(password).digest('hex');

        // Use a random iv and the key for the cipher 
        const iv = randomBytes(16);
        const cipher = createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);

        // Encrypt the proxmox password, to store on the database
        let encrypted = cipher.update(proxmox_pwd, 'utf-8', 'hex') + cipher.final('hex');

        // Store the hased key, and the encrypted proxmox password
        await client.connect();
        const db = client.db('harbor');
        const collection = db.collection('users');

        await collection.insertOne({
            username: username,
            iv: iv.toString('hex'),
            proxmox_key: encrypted,
        });
    } catch (e) {
        console.error(e);
    }
}

async function remove_user(username) {
    try {
        await client.connect();
        const db = client.db('harbor');
        const collection = db.collection('users');
        await collection.deleteOne({ username: username });
    } catch (e) {
        console.error(e);
    }
}

async function auth_user(username, password) {
    try {
        await client.connect();
        const db = client.db('harbor');
        const collection = db.collection('users');
        const user = await collection.findOne({ username: username });
        
        // Get the key from the user
        const key = createHash('sha256').update(password).digest('hex');

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        
    } catch (e) {
        console.error(e);
    }
}

module.exports = { users, add_user, remove_user, auth_user };
