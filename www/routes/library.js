/*
 * @file root.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 5, 2023
 *
 * Routes defined for /
 *
*/ 

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send();
});
