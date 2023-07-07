/*
 * @file db.js
 * @author Caleb Burke
 * @version 1.3
 * @date July 6, 2023
 *
 * Functions for interfacing with the mongodb database.
 * 
 * NOTE: Change 'uri' to the address of the mongodb server. This address
 *       will probably not work for you
*/

require('dotenv').config({ path: '../.env' }); // ONLY USE IN DEV!

const { MongoClient, MongoError } = require('mongodb');
const log = require('./log');

const uri = 'mongodb://192.168.1.222';
const dbs = 'harbor'
const client = new MongoClient(uri);

/**
 * Gets all users
 * @async
 * @returns users on mongodb
 * @todo remove this function, as it is a security risk
 * @note This function is only here for dev.
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

        await client.close();
        return users;
    } catch (e) {
        log.error(e);
    }
    return null;
}

/**
 * Gets user off database
 * @async
 * @param {string} username 
 * @returns {object} user json
 */
async function get_user(username) {
    try {
        // Connect to database
        await client.connect();

        // Get the users collection
        const db = client.db('harbor');
        const collection = db.collection('users');

        // Get the user with the username
        const user = await collection.findOne({ username: username });

        await client.close();
        return user;
    } catch (e) {
        log.error(e);
    }
    return null;
}

/**
 * Adds user to database
 * @async
 * @param {object} user - User json
 * @returns {boolean} if user was added to database
 */
async function add_user(user) {
    try {
        // Store the hased key, and the encrypted proxmox password
        await client.connect();

        // Get the users collection
        const db = client.db('harbor');
        const collection = db.collection('users');

        // Insert the user to database
        await collection.insertOne(user);

        await client.close();
        return true;
    } catch (e) {
        log.error(e);
    }
    return false;
}

/**
 * Removes user off database
 * @async
 * @param {string} username 
 * @returns {boolean} if user was removed
 */
async function remove_user(username) {
    try {
        // Connect to database
        await client.connect();

        // Get the users collection
        const db = client.db('harbor');
        const collection = db.collection('users');

        // Remove the user with the username
        await collection.deleteOne({ username: username });

        await client.close();
        return true;
    } catch (e) {
        log.error(e);
    }
    return false;
}

/**
 * Gets env variable off database
 * @async
 * @param {string} id The id of the env var you want
 * @returns {string} The value of the env var
 * @note Returns null on any errors
 */
async function get_env(id) {
    if(!id){ return null; }
    try {
        await client.connect();
        
        const env_var = await client.db(dbs).collection('env').findOne({
            id: id,
        });

        await client.close();
        return env_var.value;
    } catch (e) {
        log.error(e);
    }
    return null;
}

module.exports = {
    get_user,
    add_user,
    remove_user,
    get_env,
};
