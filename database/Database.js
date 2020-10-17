const connection = require('../database/connection').getConnection();
const User = require('./models/Users');
const Project = require('./models/Projects');

class Database {
    #connection;
    #user;
    #project;

    constructor(connection) {
        this.#connection = connection;
        this.#connection.connect((err) => {
            if (err) throw err;
            console.log("Connected to database!");
        });
        this.#user = new User(this.makeSqlQuery);
        this.#project = new Project(this.makeSqlQuery);
    }

    makeSqlQuery(sqlQuery, data = []) {
        // console.log("sqlQuery: ", sqlQuery);
        // console.log("data: ", data);
        return new Promise((resolve, reject) => {
            connection.query(sqlQuery, data, (err, result) => {
                if (err) return reject(err);
                return resolve(JSON.parse(JSON.stringify(result)));
            });
        })
    }

    addUser = (user) => this.#user.add(user);
    hasUser = (user) => this.#user.has(user);
    getUser = (user) => this.#user.get(user);
    removeUser = (user) => this.#user.remove(user);
    updateUser = (user, updateObject) => this.#user.update(user, updateObject);

    createProject = (newProject, creatorId) => this.#project.create(newProject, creatorId);
    getProject = (projectId) => this.#project.get(projectId);
    updateProject = (projectId, updateObject) => this.#project.update(projectId, updateObject);
    deleteProject = (projectId) => this.#project.delete(projectId);

    addIssue = (newIssue, projectId, creatorId) => this.#project.newIssue(newIssue, projectId, creatorId);
    getIssue = (projectId, issueId) => this.#project.getIssue(projectId, issueId);
    updateIssue = (projectId, issueId, updateObject) => this.#project.updateIssue(projectId, issueId, updateObject);
    deleteIssue = (projectId, issueId) => this.#project.deleteIssue(projectId, issueId);
}

module.exports = new Database(connection);