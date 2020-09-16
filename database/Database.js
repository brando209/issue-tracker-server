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

    addUser = async (user) => this.#user.add(user);
    hasUser = async (user) => this.#user.has(user);
    getUser = async (user) => this.#user.get(user);
    removeUser = async (user) => this.#user.remove(user);
    updateUser = (user, updateObject) => this.#user.update(user, updateObject);

    createProject = async (newProject, creatorId) => this.#project.create(newProject, creatorId);
    getProject = async (projectId) => this.#project.get(projectId);
    updateProject = async (projectId, updateObject) => this.#project.update(projectId, updateObject);
    deleteProject = async (projectId) => this.#project.delete(projectId);

}

module.exports = new Database(connection);