const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const db = require('../database/Database');

var dotenv = require('dotenv');
dotenv.config();

router.post('/register', async (req, res) => {
    // console.log(req.body);
    const newUser = JSON.parse(JSON.stringify(req.body));

    // Check if the userName and email already exist in the database
    const userExists = await db.hasUser(newUser);
    if (userExists) return res.status(400).send({ success: false, message: "Username or email already exists" });

    // Hash the new user password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    newUser.password = hashedPassword;

    //Add new user to database
    try {
        const newUserId = await db.addUser(newUser);
        res.send({ success: true, userId: newUserId });
    } catch (err) {
        res.status(400).send({ success: false, message: err });
    }
});

module.exports = router;