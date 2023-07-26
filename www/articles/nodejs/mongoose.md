# Intro to Mongoose

**Mongoose** is a library for modeling data for **Mongodb**. Using 
**Mongodb** on its own is fine, but its extreme flexibility makes the 
structureand layout of data inconsistant. **Mongoose** is essentially a 
wrapper for **Mongodb**, that uses *schemas* and *models* for 
structuring data to be saved on the database.

> Run `npm i mongoose` to install mongoose

## What is a *schema*?
A *schema* is the structure of data going to a Mongodb collection. In a
*schema* we define the fields that will be in the Mongodb collection
with its data type.

Example:
```javascript
// Import mongoose module
const mongoose = require('mongoose');

// Create a schema for a user
const user = new mongoose.Schema({
    name: String,
    password: String,
    age: Number
});
```
> `String` and `Number` are the allowed types for that field. See [mongoose types](https://mongoosejs.com/docs/schematypes.html#strings) to see all of the allowed types in mongoose.

## What is a *model*?
A *model* uses a *schema* to make / update / delete documents on the 
database. A *model* is a wrapper around *schemas*. The *schema* is the 
structure of documents, and the *model* is used to create a document 
based on that *schema*.

Example:
```javascript
// Creating a model for new users
const user_model = mongoose.model('User', user_schema);
```

## Putting something on a database
Using schemas and models we can put stuff onto a database.

Example:
```javascript
const mongoose = require('mongoose');

mongoose.connect("mongodb://<your server>/<some database>");

const user_schema = new mongoose.Schema({
    name: String,
    password: String,
    age: Number
});

// Create user model from the schema
const user_model = new mongoose.model("User", user_schema);

// Create a new 'user'
const user = new user_model({
    name: "Alice",
    password: "drowssap",
    age: 21
});

await user.save(); // To put the user on the database
```

## Finding and changing data
Finding something off a database with mongoose is essentially the same
as **Mongodb** queries. For example, lets say you created a user 
using the `user_model` from the example above and you set the `name` to
"Bob". To find the `user` with the `name` "Bob":

```javascript
// Using Mongodb queries
const user1 = await user_model.findOne({ name: 'Bob' });

// Using Mongoose's style of querying
const user2 = await user_model.where('name').equals('Bob');
```

# How mongoose is used in my website
I have blogs like this one that I want to effectively store on a 
database so I use mongoose.

## Blog *schema*
```javascript
```
