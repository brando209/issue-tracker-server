const express = require('express');
const router = express.Router();

const Users = require('../../database/models/Users');
const authorizeJWT = require('../middlewares/authorization');

router.delete('/', authorizeJWT, async (req, res) => {
    const userDeleted = await Users.removeUser({ id: req.user.id });
    if (!userDeleted.success) return res.status(400).send({ message: "User deletion failed", ...userDeleted });
    return res.status(200).send({ message: "User deleted", ...userDeleted });
});

router.patch('/', authorizeJWT, async (req, res) => {
    const userUpdated = await Users.updateUser({ id: req.user.id }, req.body);
    if (!userUpdated.success) return res.status(400).send({ success: false, message: "User update failed" });
    return res.status(200).send({ message: "User update successful", ...userUpdated });
});

module.exports = router;