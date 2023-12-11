# This basics of using mongodb
1. mongodb stores databases
2. These databases store collections
3. These collectons store documents
4. Each document is a json object

## To access mongodb:
`$ mongosh`
NOTE all commands from now are are run in the mongosh shell

## To view databases in mongodb
`> show dbs`

## Switch to database
`> use <database name>`
NOTE this is also how you create a new database

## Deleting database
`> db.dropDatabase()`
NOTE this deletes the current database

## View collections(tables) in a database
`> show collections`

## View objects in collection
`> db.<colllection name>.find()`

## Adding a json to a collection
`> db.<collection name>.insertOne({ <key>: <value> })`

## Basic config settings for mongodb

mongodb does not listen on an open port by default,
edit the /etc/mongodb.conf file.

Change the line bindIp to 0.0.0.0 for all ipv4 addresses
