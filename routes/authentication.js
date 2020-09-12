const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../database/Database');
const authorizeJWT = require('../middlewares/authorization');

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

router.post('/login', async (req, res) => {
    //Verify that the user exists
    const userExists = await db.hasUser({ userName: req.body.userName, email: req.body.email });
    if (!userExists) return res.status(400).send({ success: false, message: "User does not exist" });

    const user = await db.getUser({ userName: req.body.userName, email: req.body.email });

    // Verify that the password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({ success: false, message: "Invalid password." });

    // Create and assign auth token (for authorization)
    const token = jwt.sign({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email
    }, process.env.TOKEN_SECRET);

    return res.json({ success: true, token: token });
});

router.get('/protected', authorizeJWT, (req, res) => {
    return res.status(200).send("User id: " + req.user.id);
});

router.delete('/user', authorizeJWT, async (req, res) => {
    const userDeleted = await db.removeUser({ id: req.user.id }).catch(err => console.log(err));
    if (userDeleted) return res.status(200).send({ success: true, message: "User deleted" });
    return res.status(400).send({ success: false, message: "User deletion failed" });
})

router.patch('/user', authorizeJWT, async (req, res) => {
    const userUpdated = await db.updateUser({ id: req.user.id }, req.body.update);
    if (userUpdated) { return res.status(200).send({ success: true, message: "User update successful" }) }
    return res.status(400).send({ success: false, message: "User update failed" });
});

module.exports = router;