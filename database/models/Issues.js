const { setUpdateString } = require('../utils');

class Issue {
    makeSqlQuery;
    constructor(makeSqlQuery) {
        this.makeSqlQuery = makeSqlQuery;
    }

    async create(issue, projectId, creatorId) {
        const addIssueQuery = `INSERT INTO issues (title, description, category, priority, creatorId, projectId) VALUES (?)`;
        const values = [issue.title, issue.description, issue.category, issue.priority, creatorId, projectId];

        const result = await this.makeSqlQuery(addIssueQuery, [values])
            .then(data => ({ success: true, issueId: data.insertId}))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async get(projectId, issueId) {
        const getIssueQuery = `SELECT * FROM issues WHERE id = ?`;
        const result = await this.makeSqlQuery(getIssueQuery, issueId);
        return result;
    }

    async update(projectId, issueId, updateObject) {
        // Create string argument for SET clause of update query
        const updateString = setUpdateString(updateObject);

        const sqlQuery = `UPDATE issues SET ${updateString} WHERE id = ?`;
        const issueUpdated = await this.makeSqlQuery(sqlQuery, issueId);
        return issueUpdated;
    }

    async delete(projectId, issueId) {
        const sqlQuery = "DELETE FROM issues WHERE id = ?";
        const issueDeleted = await this.makeSqlQuery(sqlQuery, projectId).then(data => data.affectedRows);
        return issueDeleted;
    }

}

module.exports = Issue;