const Table = require('./Table');

class Users {
    constructor() {
        this.table = new Table("users");
    }

    createUser(newUser) {
        return this.table.createEntry(newUser);
    }

    getUser(user) {
        return this.table.getEntry("*", [`userName = '${user.userName}'`, `email = '${user.email}'`]);
    }

    getUserById(userId) {
        return this.table.getEntry(["id", "firstName", "lastName", "userName", "email"], `id='${userId}'`);
    }

    removeUser(user) {
        return this.table.removeEntrys(`id=${user.id}`);
    }

    updateUser(user, updateObject) {
        return this.table.updateEntrys(`id=${user.id}`, updateObject);
    }
}

module.exports = new Users;