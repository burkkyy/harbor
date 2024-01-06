# Creating users in proxmox

## There are two different kinds of users
1. PVE
2. PAM

### PVE
PVE users have access to the proxmox gui and vms

### PAM
Same thing as PVE users, but has ssh access to the proxmox server.
Creating a PAM users requires creating the user in the GUI,
and also through the console in a node.

#### Creating PAM user
1. useradd <username>
2. passwd <username>

## Creating Users specific spaces
In order to create a space where a users can only access vms
it has created, we have to use pools.

1. Create a pool with the name of the user
2. Under permissons of the created pool, set the user for the pool
as Administrator. Or what ever permissons you want. NOTE: The permissons
you set for the pool only apply to THAT pool.
3. Under members, add the storage so the pools have storage to allocate.
4. Also under members you can add vms from other pools

## Adding storage for a user:
$`pvesm add <TYPE> <STORAGE_ID> <OPTIONS>`

## To add a dir specifically for a users:
$`pvesm add dir local-something --path /var/lib/vz# --content images,rootdir,iso,vztmpl`

