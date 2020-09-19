const { setUpdateString } = require('../utils');

class Users {
    makeSqlQuery;
    constructor(makeSqlQuery) {
        this.makeSqlQuery = makeSqlQuery;
    }

    async add(user) {
        const sqlQuery = "INSERT INTO users (firstName, lastName, userName, email, password) VALUES (?)";
        const values = [user.firstName, user.lastName, user.userName, user.email, user.password];
        const result = await this.makeSqlQuery(sqlQuery, [values]);
        return result.insertId;
    }

    async has(user) {
        if (!user || (!user.email && !user.userName)) { return false; }
        const sqlQuery = "SELECT * FROM users WHERE userName = ? OR email = ?";
        // Query database to see if user with same userName or email exists
        const userExists = await this.makeSqlQuery(sqlQuery, [user.userName, user.email]).then(data => data.length).catch(err => new Error("Error accessing database"));
        return userExists;
    }

    async get(user) {
        if (!user || (!user.email && !user.userName)) { return null; }

        // Query the database by userName first, if none then query by email
        let sqlQuery = "SELECT * FROM users WHERE userName = ?";
        let value = user.userName;
        if (!user.userName) {
            sqlQuery = "SELECT * FROM users WHERE email = ?";
            value = user.email;
        }
        // Query database to see if user with same userName or email exists
        const existingUser = await this.makeSqlQuery(sqlQuery, value).then(data => data[0]).catch(err => new Error("Error accessing database"));
        return existingUser;
    }

    async remove(user) {
        if (!user || !user.id) { return false; }

        const sqlQuery = "DELETE FROM users WHERE id = ?";
        const userDeleted = await this.makeSqlQuery(sqlQuery, user.id).then(data => data[0]).catch(err => new Error("Error accessing database"));

        return userDeleted;
    }

    async update(user, updateObject) {
        if (!user || !user.id) { return null; }

        const updateString = setUpdateString(updateObject);

        const sqlQuery = `UPDATE users SET ${updateString} WHERE id = ?`;
        const updatedUser = await this.makeSqlQuery(sqlQuery, user.id).then(data => data.changedRows).catch(err => new Error("Error accessing database"));
        return updatedUser ? true : false;
    }
}

module.exports = Users;