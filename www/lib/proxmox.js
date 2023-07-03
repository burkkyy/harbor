/*
 * @file proxmox.js
 * @author Caleb Burke
 * @version 1.2
 * @date July 1, 2023
 *
 * Functions for interfacing with the proxmox api
 * 
*/

require('dotenv').config();

const URL = 'https://calebburke.dev/proxmox/api2/json/';

function call(uri, body) {
    fetch(URL + uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `PVEAPIToken=harbor@pve!${process.env.API_ID}=${process.env.API_KEY}`,
        },
        body: JSON.stringify(body)
    })
        .then((res) => { return res.ok; })
        .catch((e) => {
            console.error(e);
            return false;
        });
}

function create_user(username, password) {
    const user = {
        userid: `${username}@pve`,
        comment: 'User created with api',
        password: password,
        email: '',
        enable: 1
    };

    console.log('Creating proxmox user:', user);

    fetch(URL + 'access/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `PVEAPIToken=harbor@pve!${process.env.API_ID}=${process.env.API_KEY}`,
        },
        body: JSON.stringify(user)
    }).then((res) => { return res.ok; });
}

/*
 * Creates a new pool and custom storage for a certain user
 */
function create_user_env(username, password) {
    // Create storage for user
    const storage = {
        storage: username,
        type: 'dir',
        path: `/var/lib/vz-${username}`,
        content: 'images',
    };

    return call('storage', storage);
}

function get_ticket(username, password) {
    console.log(`username: ${username}\npassword: ${password}`);
    console.log('Getting proxmox access token...');

    // Fetch the proxmox access token
    fetch(URL + 'access/ticket', {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(username)}@pam&password=${encodeURIComponent(password)}`
    }).then(async (res) => {
        if (!response.ok) { throw response.status; }
        return (await response.json()).data;
    }).catch((e) => {
        console.error(e);
        return null;
    });
}

module.exports = { create_user, get_ticket };
