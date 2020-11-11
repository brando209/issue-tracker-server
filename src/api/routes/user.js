const express = require('express');
const router = express.Router();

const UserService = require('../../services/UserService');
const authorizeJWT = require('../middlewares/authorization');

router.delete('/', authorizeJWT, async (req, res) => {
    try {
        await UserService.deleteAccount(req.user.id);
        return res.status(200).send({ success: true, message: "User deleted"});
    } catch(err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.patch('/', authorizeJWT, async (req, res) => {
    try {
        const updatedUser = await UserService.changeAccountDetails(req.user.id, req.body);
        return res.status(200).send({ message: "User update successful", user: updatedUser });
    } catch(err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.patch('/changePassword', authorizeJWT, async (req, res) => {
    try {
        await UserService.changePassword(req.user.id, req.body.password);
        return res.status(200).send({ message: "Password update successful", success: true });
    } catch(err) {
        console.log(err);
        return res.status(400).send({ success: false, message: "Password not updated", error: err });
    }
});

module.exports = router;