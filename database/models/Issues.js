const { setUpdateString } = require('../utils');

class Issue {
    constructor(makeSqlQuery) {
        this.makeSqlQuery = makeSqlQuery;
    }

    async createIssue(issue, projectId, creatorId) {
        const addIssueQuery = `INSERT INTO issues (title, description, category, priority, creatorId, projectId) VALUES (?)`;
        const values = [issue.title, issue.description, issue.category, issue.priority, creatorId, projectId];

        const result = await this.makeSqlQuery(addIssueQuery, [values])
            .then(data => ({ success: true, issueId: data.insertId}))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async getSingleIssue(projectId, issueId) {
        const getIssueQuery = `SELECT * FROM issues WHERE id = ?`;

        const result = await this.makeSqlQuery(getIssueQuery, issueId)
            .then(data => ({ success: true, issue: data[0] }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async getAllIssues(projectId) {
        const getAllQuery = `
            SELECT issues.* FROM issues 
            INNER JOIN projects 
            ON issues.projectId = projects.id 
            Where issues.projectId = ?`

        const result = await this.makeSqlQuery(getAllQuery, projectId)
            .then(data => ({ success: true, issues: data }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result
    }

    async updateIssue(projectId, issueId, updateObject) {
        // Create string argument for SET clause of update query
        const updateString = setUpdateString(updateObject);
        const sqlQuery = `UPDATE issues SET ${updateString} WHERE id = ?`;

        const result = await this.makeSqlQuery(sqlQuery, issueId)
            .then(data => ({ success: data.changedRows ? true : false }))
            .catch(err => ({ success: false, message: err.sqlMessage }));
    
        if(result.success) {
            return this.getSingleIssue(projectId, issueId);
        }

        return result;
    }

    async removeIssue(projectId, issueId) {
        const sqlQuery = "DELETE FROM issues WHERE id = ?";

        const result = await this.makeSqlQuery(sqlQuery, projectId)
            .then(data => ({ success: data.affectedRows ? true : false }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

}

module.exports = Issue;