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

    createUser = (user) => this.#user.createUser(user);
    hasUser = (user) => this.#user.hasUser(user);
    getUser = (user) => this.#user.getUser(user);
    updateUser = (user, updateObject) => this.#user.updateUser(user, updateObject);
    removeUser = (user) => this.#user.removeUser(user);

    createProject = (newProject, creatorId) => this.#project.createProject(newProject, creatorId);
    getProject = (projectId) => this.#project.getSingleProject(projectId);
    updateProject = (projectId, updateObject) => this.#project.updateProject(projectId, updateObject);
    deleteProject = (projectId) => this.#project.removeProject(projectId);

    addIssue = (newIssue, projectId, creatorId) => this.#project.newIssue(newIssue, projectId, creatorId);
    getIssue = (projectId, issueId) => this.#project.getSingleIssue(projectId, issueId);
    updateIssue = (projectId, issueId, updateObject) => this.#project.updateIssue(projectId, issueId, updateObject);
    deleteIssue = (projectId, issueId) => this.#project.removeIssue(projectId, issueId);
}

module.exports = new Database(connection);