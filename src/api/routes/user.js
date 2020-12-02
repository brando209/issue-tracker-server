const express = require('express');
const router = express.Router();

const UserService = require('../../services/user/UserService');
const authorization = require('../middlewares/authorization');

router.use(authorization.authorizeJWT);

router.get('/', async (req, res) => {
    try {
        const userRecord = await UserService.getAccountDetails(req.user.id);
        return res.status(200).send({ success: true, message: "User retrieved", user: userRecord });
    } catch(err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        await UserService.deleteAccount(req.user.id);
        return res.status(200).send({ success: true, message: "User deleted"});
    } catch(err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.patch('/', async (req, res) => {
    try {
        const updatedUser = await UserService.changeAccountDetails(req.user.id, req.body);
        return res.status(200).send({ success: true, message: "User update successful", user: updatedUser });
    } catch(err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.patch('/changePassword', async (req, res) => {
    try {
        await UserService.changePassword(req.user.id, req.body.password);
        return res.status(200).send({ success: true, message: "Password update successful" });
    } catch(err) {
        return res.status(400).send({ success: false, message: "Password not updated" });
    }
});

router.get('/login', authorization.authorizeJWT, async (req, res) => {
    try {
        const userRecord = await UserService.getAccountDetails(req.user.id);
        return res.status(200).send({ success: true, message: "User account retrieved", user: userRecord });
    } catch(err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

module.exports = router;