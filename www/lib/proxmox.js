/*
 * @file proxmox.js
 * @author Caleb Burke
 * @version 1.5
 * @date July 7, 2023
 *
 * Functions for interfacing with the proxmox api
 * 
*/

require('dotenv').config({ path: '../.env' }); // ONLY USE IN DEV!

const log = require('./log');
const db = require('./db');

const URL = 'https://calebburke.dev/proxmox/api2/json/';
const comment = 'Created from harbor through proxmox api';

/**
 * Gets the token id and secret key for a proxmox api call
 * @helper
 * @async
 * @returns {string} The api id and key for Auth header in a proxmox api call
 * @note On database fault function throws string
 */
async function get_auth() {
    const api_id = await db.get_env('PROXMOX_API_ID');
    const api_key = await db.get_env('PROXMOX_API_KEY');

    if (api_id == null) {
        throw 'Failed to get proxmox api id off database. Is it offline?';
    } else if (api_key == null) {
        throw 'Failed to get proxmox api key off database. Is it offline?';
    }

    return `PVEAPIToken=harbor@pve!${api_id}=${api_key}`;
}

/**
 * Makes api call to proxmox server
 * @helper
 * @async
 * @param {string} uri - Type of api call i.e. access/users gets all users
 * @param {object} body - (json) content of http req
 * @param {string} method - = 'POST', method of http req
 * @returns {boolean} if call returned http status code 200 - 299
 */
async function call(uri, body, method = 'POST') {
    const auth = await get_auth();

    const res = await fetch(URL + uri, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth,
        },
        body: JSON.stringify(body)
    }).catch((e) => {
        log.error(e);
        return false;
    });

    return res.ok;
}

/**
 * Makes api call to proxmox server to delete something
 * @helper
 * @async
 * @param {string} uri - Type of api call i.e. access/users/{userid} deletes {userid} 
 * @returns fetch response obj
 */
async function delete_call(uri) {
    const auth = await get_auth();

    return fetch(URL + uri, {
        method: 'DELETE',
        headers: {
            'Authorization': auth,
        },
    });
}

/**
 * Creates a user on proxmox
 * @helper
 * @async
 * @param {string} username
 * @param {string} password
 * @returns fetch response obj
 */
async function create_user(username, password) {
    return await call('access/users', {
        userid: `${username}@pve`,
        password: password,
        enable: 1,
        comment: comment,
    });
}

/**
 * Creates a dir storage on proxmox with id *username*
 * @helper
 * @async
 * @param {string} username 
 * @returns fetch response obj
 */
async function create_storage(username) {
    /* Storages on proxmox dont have comments */
    return await call('storage', {
        storage: username,
        type: 'dir',
        path: `/var/lib/users/${username}`,
        content: 'images',
    });
}

/**
 * Creates a pool on proxmox with id *username*
 * @helper
 * @async
 * @param {string} username 
 * @returns fetch response obj
 */
async function create_pool(username) {
    return await call('pools', {
        poolid: username,
        comment: comment,
    });
}

/**
 * Gets proxmox pveauth ticket and csrf token
 * @async
 * @param {string} username - username of proxmox user
 * @param {string} password - password of proxmox user
 * @return {object} json with pve ticket and csrf token
 * @note returns null on any error
 * @note assumes pve user
 */
async function get_ticket(username, password) {
    try {
        const res = await fetch(URL + 'access/ticket', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}@pve&password=${encodeURIComponent(password)}`
        });

        if (res.ok) { return (await res.json()).data; }
    } catch (e) {
        log.error(e);
    }
    return null;
}

/**
 * Create user space i.e. create a user with their own pool and storage
 * @async
 * @param {string} username
 * @param {string} password 
 * @returns {boolean} If user was fully created
 * @todo Add better error handling i.e. do more then return false on faults
 */
async function create_user_space(username, password) {
    if (!username || !password) { return false; }

    if (!(await create_user(username, password))) { return false; }
    if (!(await create_storage(username))) { return false; }
    if (!(await create_pool(username))) { return false; }

    // Add the storage to the pool
    const pool_res = await call(`pools/${username}`, {
        "storage": `template,${username}`,
    }, 'PUT');

    if (!pool_res) { return false; }

    // Make the user admin of the pool
    const prem_res = await call(`/access/acl`, {
        "path": `/pool/${username}`,
        "roles": "Administrator",
        "users": `${username}@pve`
    }, 'PUT');

    if (!prem_res) { return false; }

    return true;
}

/**
 * Deletes user space i.e. deletes the storage, pool of a user and the user
 * @async
 * @param {string} username 
 * @returns {boolean} If user space was deleted
 * @todo In the proxmox node, /var/lib/users (where I decided to store storage dir's)
 * the dir is not removed. Only in the gui its removed.
 * @note No handling of permissions needed, proxmox removes that on 
 * user/pool/storage deletion.
 */
async function delete_user_space(username) {
    if (!username) { return false; }

    /* 
    Before deleting, clear pool of all members. This does not delete the vms
    and containers, but just removes it from the pool. Proxmox only allows the
    deletion of a pool with no members.
    */
    const auth = await get_auth();

    let res = await fetch(URL + `pools/${username}`, {
        method: 'GET',
        headers: {
            'Authorization': auth,
        },
    }).catch((e) => {
        log.error(e);
        return false;
    });

    if (!res.ok) {
        log.error(res.statusText);
        return false;
    }

    const members = (await res.json()).data.members;

    let storages = [];
    let vms = [];

    for (const member of members) {
        if (member.type === 'storage') {
            storages.push(member.storage);
        } else if (member.type === 'lxc') {
            vms.push(member.vmid);
        }
    }

    res = await fetch(URL + `pools/${username}`, {
        method: 'PUT',
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            delete: true,
            storage: storages.toString(),
            vms: vms.toString(),
        })
    }).catch((e) => {
        log.error(e);
        return false;
    });

    if (!res.ok) {
        log.error(res.statusText);
        return false;
    }

    // Delete the user storage
    res = await delete_call('storage/' + username);
    if (!res.ok) {
        log.error(uri + ': ' + res.statusText);
        return false;
    }

    // Delete the user pool
    res = await delete_call('pools/' + username);
    if (!res.ok) {
        log.error(uri + ': ' + res.statusText);
        return false;
    }

    // Delete the user
    res = await delete_call('access/users/' + username + "@pve");
    if (!res.ok) {
        log.error(uri + ': ' + res.statusText);
        return false;
    }

    return true;
}

module.exports = {
    get_ticket,
    create_user_space,
    delete_user_space,
};
