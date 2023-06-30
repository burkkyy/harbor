/*
 * @file db.js
 * @author Caleb Burke
 * @version 1.1
 * @date June 30, 2023
 *
 * Functions for interfacing with the mongodb database
 * 
*/

require('dotenv').config();

const bcrypt = require('bcrypt');
const base85 = require('base85');
const { randomBytes, createHash, createCipheriv, createDecipheriv } = require('crypto');
const { MongoClient, MongoError } = require('mongodb');

const uri = 'mongodb://192.168.1.222';
const client = new MongoClient(uri);

/*
 * This function is only here for dev.
 * TODO remove this function, as it is a security risk
 */
async function users() {
    try {
        // Connect to database
        await client.connect();

        // Get the users collection
        const db = client.db('harbor');
        const collection = db.collection('users');

        // Get all the users and return them
        const users = await collection.find({}).toArray();
        return users;
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function get_user(username) {
    try {
        // Connect to database
        await client.connect();

        // Get the users collection
        const db = client.db('harbor');
        const collection = db.collection('users');

        // Get the user with the username
        const user = await collection.findOne({ username: username });
        return user;
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function add_user(user) {
    try {
        // Store the hased key, and the encrypted proxmox password
        await client.connect();

        // Get the users collection
        const db = client.db('harbor');
        const collection = db.collection('users');

        // Insert the user to database
        await collection.insertOne(user);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function remove_user(username) {
    try {
        // Connect to database
        await client.connect();

        // Get the users collection
        const db = client.db('harbor');
        const collection = db.collection('users');

        // Remove the user with the username
        await collection.deleteOne({ username: username });
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

module.exports = { add_user, get_user };
