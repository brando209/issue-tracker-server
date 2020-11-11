const bcrypt = require('bcryptjs');
const config = require('../config');
const { Users } = require('../database/models');

class UserService {

    async changePassword(userId, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const update = { password: hashedPassword };
        const passwordChanged = await Users.updateUser(userId, update);
        if(!passwordChanged.success) throw new Error("Unable to update user password");
        return passwordChanged;
    }

    async changeAccountDetails(userId, newDetails) {
        const detailsChanged = await Users.updateUser(userId, newDetails);
        if(!detailsChanged.success) throw new Error("Unable to update user account details");

        const userRecord = await Users.getUserById(userId);
        if(!userRecord.success) throw new Error("Unable to retrieve updated user account details");

        return userRecord.data;
    }

    async deleteAccount(userId) {
        const userDeleted = await Users.removeUser(userId);
        if(!userDeleted.success) throw new Error("Unable to delete user account");

        return userDeleted.data;
    }

}

module.exports = new UserService;
