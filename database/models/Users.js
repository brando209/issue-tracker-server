const { setUpdateString } = require('../utils');

class Users {
    constructor(makeSqlQuery) {
        this.makeSqlQuery = makeSqlQuery;
    }

    async createUser(newUser) {
        const sqlQuery = "INSERT INTO users (firstName, lastName, userName, email, password) VALUES (?)";
        const values = [newUser.firstName, newUser.lastName, newUser.userName, newUser.email, newUser.password];

        const result = await this.makeSqlQuery(sqlQuery, [values])
            .then(data => ({ success: true, userId: data.insertId }))
            .catch(err => ({ success: false, messgae: err.sqlQuery }));

        return result;
    }

    async hasUser(user) {
        if (!user || (!user.email && !user.userName)) return false;

        const sqlQuery = "SELECT * FROM users WHERE userName = ? OR email = ?";
        // Query database to see if user with same userName or email exists
        const result = await this.makeSqlQuery(sqlQuery, [user.userName, user.email])
            .then(data => data.length ? true : false)
            .catch(err => false);

        return result;
    }

    async getUser(user) {
        if (!user || (!user.email && !user.userName)) return { success: false, message: "Invalid username or email provided" }

        // Query the database by userName first, if none then query by email
        let sqlQuery = "SELECT * FROM users WHERE userName = ?";
        let value = user.userName;
        if (!user.userName) {
            sqlQuery = "SELECT * FROM users WHERE email = ?";
            value = user.email;
        }

        // Query database to see if user with same userName or email exists
        const result = await this.makeSqlQuery(sqlQuery, value)
            .then(data => ({ success: true, user: data[0]} ))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async removeUser(user) {
        if (!user || !user.id) return { success: false, message: "Invalid user ID provided" }
        
        const sqlQuery = "DELETE FROM users WHERE id = ?";

        const result = await this.makeSqlQuery(sqlQuery, user.id)
            .then(data => ({ success: data.affectedRows ? true : false }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async updateUser(user, updateObject) {
        if (!user || !user.id) return { success: false, message: "Invalid user ID provided" }

        const updateString = setUpdateString(updateObject);
        const sqlQuery = `UPDATE users SET ${updateString} WHERE id = ?`;

        const result = await this.makeSqlQuery(sqlQuery, user.id)
            .then(data => ({ success: data.changedRows ? true : false }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }
}

module.exports = Users;