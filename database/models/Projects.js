const Issue = require('./Issues');
const { setUpdateString } = require("../utils");

class Projects {
    makeSqlQuery;
    issue;
    constructor(makeSqlQuery) {
        this.makeSqlQuery = makeSqlQuery;
        this.issue = new Issue(makeSqlQuery);
    }

    async create(newProject, creatorId) {
        const sqlQuery = "INSERT INTO projects (name, description, creatorId) VALUES (?)";
        const values = [newProject.name, newProject.description, creatorId];
        const newProjectId = await this.makeSqlQuery(sqlQuery, [values]).then(data => data.insertId);
        return newProjectId;
    }

    async get(projectId) {
        const sqlQuery = `
        SELECT p.id, p.name, p.description, u.userName as creator 
        FROM projects p 
        INNER JOIN users u 
        ON p.creatorId = u.id 
        WHERE p.id = ?`;
        const project = await this.makeSqlQuery(sqlQuery, projectId).then(data => data[0]).catch(err => new Error("Error accessing database"));
        return project ? project : null;
    }

    async update(projectId, updateObject) {
        // Create string argument for SET clause of update query
        const updateString = setUpdateString(updateObject);

        const sqlQuery = `UPDATE projects SET ${updateString} WHERE id = ?`;
        const projectUpdated = await this.makeSqlQuery(sqlQuery, projectId).then(data => data.changedRows).catch(err => false);
        return projectUpdated;
    }

    async delete(projectId) {
        const sqlQuery = "DELETE FROM projects WHERE id = ?";
        const projectDeleted = await this.makeSqlQuery(sqlQuery, projectId).then(data => data.affectedRows).catch(err => false);
        return projectDeleted;
    }

    newIssue = (issue, projectId, creatorId) => this.issue.create(issue, projectId, creatorId);
    getIssue = (projectId, issueId) => this.issue.get(projectId, issueId);
}

module.exports = Projects;