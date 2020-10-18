const Issue = require('./Issues');
const { setUpdateString } = require("../utils");

class Projects {
    makeSqlQuery;
    issue;
    constructor(makeSqlQuery) {
        this.makeSqlQuery = makeSqlQuery;
        this.issue = new Issue(makeSqlQuery);
    }

    async createProject(newProject, creatorId) {
        const sqlQuery = "INSERT INTO projects (name, description, creatorId) VALUES (?)";
        const values = [newProject.name, newProject.description, creatorId];

        const result = await this.makeSqlQuery(sqlQuery, [values])
            .then(data => ({ success: true, projectId: data.insertId }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async getSingleProject(projectId) {
        const sqlQuery = `
            SELECT p.id, p.name, p.description, u.userName as creator 
            FROM projects p 
            INNER JOIN users u 
            ON p.creatorId = u.id 
            WHERE p.id = ?`;
    
        const result = await this.makeSqlQuery(sqlQuery, projectId)
            .then(data => ({success: true, project: data[0]}))
            .catch(err => ({success: false, message: err.sqlMessage }));

        return result;
    }

    async updateProject(projectId, updateObject) {
        // Create string argument for SET clause of update query
        const updateString = setUpdateString(updateObject);
        const sqlQuery = `UPDATE projects SET ${updateString} WHERE id = ?`;

        const result = await this.makeSqlQuery(sqlQuery, projectId)
            .then(data => ({ success: data.changedRows ? true : false }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async removeProject(projectId) {
        const sqlQuery = "DELETE FROM projects WHERE id = ?";

        const projectDeleted = await this.makeSqlQuery(sqlQuery, projectId)
            .then(data => ({ success: data.affectedRows ? true : false }))
            .catch(err => ({ success: false, message: err.sqlMessage }));
        return projectDeleted;
    }

    newIssue = (issue, projectId, creatorId) => this.issue.createIssue(issue, projectId, creatorId);
    getIssue = (projectId, issueId) => this.issue.getIssue(projectId, issueId);
    updateIssue = (projectId, issueId, updateObject) => this.issue.updateIssue(projectId, issueId, updateObject);
    removeIssue = (projectId, issueId) => this.issue.removeIssue(projectId, issueId);
}

module.exports = Projects;