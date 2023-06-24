/*
 * @file proxmox.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 24, 2023
 *
 * Functions for interfacing with the proxmox api
 * 
*/

async function get_ticket(username, password) {
    console.log(`username: ${username}\npassword: ${password}`);
    console.log('Getting proxmox access token...');

    // Fetch the proxmox access token
    const proxmox_response = await fetch('https://calebburke.dev/proxmox/api2/json/access/ticket', {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(username)}@pam&password=${encodeURIComponent(password)}`
    });

    // Check if fetch succeeded, and the ticket is valid
    if (!proxmox_response.ok) { throw proxmox_response.status; }

    const ticket_json = await proxmox_response.json();

    if (ticket_json.data == null) { throw 500; }

    return ticket_json.data.ticket;
}

module.exports = { get_ticket };
