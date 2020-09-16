const connection = require('../database/connection').getConnection();

class Database {
    #connection;
    constructor(connection) {
        this.#connection = connection;
        this.#connection.connect((err) => {
            if (err) throw err;
            console.log("Connected to database!");
        });
    }

    makeSqlQuery(sqlQuery, data = []) {
        // console.log("sqlqQery: ", sqlQuery);
        // console.log("data: ", data);
        return new Promise((resolve, reject) => {
            connection.query(sqlQuery, data, (err, result) => {
                if (err) return reject(err);
                return resolve(JSON.parse(JSON.stringify(result)));
            });
        })
    }

    async addUser(user) {
        const sqlQuery = "INSERT INTO users (firstName, lastName, userName, email, password) VALUES (?)";
        const values = [user.firstName, user.lastName, user.userName, user.email, user.password];
        const result = await this.makeSqlQuery(sqlQuery, [values]);
        return result.insertId;
    }

    //Checks the 'email' and the 'userName' properties of 'user' object against the database
    async hasUser(user) {
        if(!user || (!user.email && !user.userName)) { return false; }
        const sqlQuery = "SELECT * FROM users WHERE userName = ? OR email = ?";
        // Query database to see if user with same userName or email exists
        const userExists = await this.makeSqlQuery(sqlQuery, [user.userName, user.email]).then(data => data.length).catch(err => new Error("Error accessing database"));
        return userExists;
    }

    async getUser(user) {
        if(!user || (!user.email && !user.userName)) { return null; }

        // Query the database by userName first, if none then query by email
        let sqlQuery = "SELECT * FROM users WHERE userName = ?";
        let value = user.userName;
        if(!user.userName) {
            sqlQuery = "SELECT * FROM users WHERE email = ?";
            value = user.email;
        }
        // Query database to see if user with same userName or email exists
        const existingUser = await this.makeSqlQuery(sqlQuery, value).then(data => data[0]).catch(err => new Error("Error accessing database"));
        return existingUser;
    }

    async removeUser(user) {
        if(!user || !user.id) { return false; }

        const sqlQuery = "DELETE FROM users WHERE id = ?";
        const userDeleted = await this.makeSqlQuery(sqlQuery, user.id).then(data => data[0]).catch(err => new Error("Error accessing database"));

        return userDeleted;
    }

    async updateUser(user, updateObject) {
        if(!user || !user.id) { return null; }

        // Create string for SET clause of update query
        let updates = "";
        for(let key of Object.keys(updateObject)) { updates += `${key} = '${updateObject[key]}', ` }
        updates = updates.substring(0, updates.length - 2); //remove last comma

        //
        const sqlQuery = `UPDATE users SET ${updates} WHERE id = ?`;   
        const updatedUser = await this.makeSqlQuery(sqlQuery, user.id).then(data => data.changedRows).catch(err => new Error("Error accessing database"));
        return updatedUser ? true : false;
    }

    async createProject(newProject, creatorId) {
        const sqlQuery = "INSERT INTO projects (name, description, creatorId) VALUES (?)";
        const values = [newProject.name, newProject.description, creatorId];
        const newProjectId = await this.makeSqlQuery(sqlQuery, [values]).then(data => data.insertId);
        return newProjectId;
    }

    async getProject(projectId) {
        const sqlQuery = `
        SELECT p.id, p.name, p.description, u.userName as creator 
        FROM projects p 
        INNER JOIN users u 
        ON p.creatorId = u.id 
        WHERE p.id = ?`;
        const project = await this.makeSqlQuery(sqlQuery, projectId).then(data => data[0]).catch(err => new Error("Error accessing database"));
        return project ? project : null;
    }

    async updateProject(projectId, updateObject) {
        // Create string argument for SET clause of update query
        let updates = "";
        for(let key of Object.keys(updateObject)) { updates += `${key} = '${updateObject[key]}', ` }
        updates = updates.substring(0, updates.length - 2); //remove last comma

        const sqlQuery = `UPDATE projects SET ${updates} WHERE id = ?`;
        const projectUpdated = await this.makeSqlQuery(sqlQuery, projectId).then(data => data.changedRows).catch(err => false);
        return projectUpdated;
    }

    async deleteProject(projectId) {
        const sqlqQery = "DELETE FROM projects WHERE id = ?";
        const projectDeleted = await this.makeSqlQuery(sqlqQery, projectId).then(data => data.affectedRows).catch(err => false);
        return projectDeleted;
    }
}

module.exports = new Database(connection);