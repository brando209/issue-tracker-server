const db = require('../Database');
const { makeUpdateArray } = require('../utils');

class Users {

    async createUser(newUser) {
        const result = await db.addRecord("users", newUser)
            .then(data => ({ success: true, userId: data.insertId }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async hasUser(user) {
        if (!user || (!user.email && !user.userName)) return false;
        // Query database to see if user with same userName or email exists
        const result = await db.query("users", "*", [`userName = '${user.userName}'`, `email = '${user.email}'`])
            .then(data => data.length ? true : false)
            .catch(err => false);

        return result;
    }

    async getUser(user) {
        if (!user || (!user.email && !user.userName)) return { success: false, message: "Invalid username or email provided" }

        // Query database to see if user with same userName or email exists
        const result = await db.query("users", "*", [`userName = '${user.userName}'`, `email = '${user.email}'`])
            .then(data => ({ success: true, user: data[0]} ))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async removeUser(user) {
        if (!user || !user.id) return { success: false, message: "Invalid user ID provided" }

        const result = await db.removeRecords("users", `id=${user.id}`)
            .then(data => ({ success: data.affectedRows ? true : false }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async updateUser(user, updateObject) {
        if (!user || !user.id) return { success: false, message: "Invalid user ID provided" }

        const result = await db.updateRecords("users", makeUpdateArray(updateObject),`id=${user.id}`)
            .then(data => ({ success: data.changedRows ? true : false }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }
}

module.exports = new Users;