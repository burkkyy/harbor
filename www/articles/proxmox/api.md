# Using the proxmox api

NOTE: For all these sections, in your POST req set the header 
`Authorization` with the value `PVEAPIToken=USER@REALM!TOKENID=UUID`.

>The token id is the id of the API token created in proxmox, and the UUID
is the secret key associated with that token id.

See [proxmox api](https://pve.proxmox.com/wiki/Proxmox_VE_API) for more info
and the [api viewer](https://pve.proxmox.com/pve-docs/api-viewer/) for full documentation of the proxmox api.

## Creating a user
1. Create a json called *user* that defines the user:
```json
    {
        "userid": "<username>@pve",
        "password": "<password>",
        "enable": 1,
        "comment": "<some comment>",
    }
```
2. Send *user* as a string in the body of a POST req to access/users

## Creating a storage
1. Create a json called *storage* that defines the storage:
```json
    {
        "storage": "<name of storage>",
        "type": "dir",
        "path": "/var/lib/vz-<name>", // This is on the proxmox node
        "content": "images,<more content types>",
    }
```
2. Send *storage* as a string in the body of a POST req to storage/ 

## Creating a pool
1. Create a json called *pool* that defines the pool
```json
    {
        "poolid": "<name of pool>",
        "comment": "<some comment>",
    }
```
2. Send *pool* as a string in the body of a POST req to pool/
