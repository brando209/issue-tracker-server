const express = require('express');
const router = express.Router();
const db = require('../database/connection');

var dotenv = require('dotenv');
dotenv.config();

router.post('/register', async (req, res) => {
    return res.json("Success");
});

module.exports = router;