const db = require('../Database');
const { makeUpdateArray } = require('../utils');

class Issue {

    async createIssue(issue, projectId, creatorId) {
        const result = await db.addRecord("issues", { ...issue, creatorId, projectId })
            .then(data => ({ success: true, issueId: data.insertId}))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async getSingleIssue(projectId, issueId) {
        const result = await db.query("issues", "*", `id=${issueId}`)
            .then(data => ({ success: data.length > 0 ? true : false, issue: data[0] }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async getAllIssues(projectId) {
        const joinOptions = { joinTable: "projects", joinColumns: `issues.projectId = projects.id`}
        const result = await db.query("issues", "issues.*", `issues.projectId=${projectId}`, "*", joinOptions)
            .then(data => ({ success: data.length > 0 ? true : false, issues: data }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result
    }

    async updateIssue(projectId, issueId, updateObject) {
        const result = await db.updateRecords("issues", makeUpdateArray(updateObject), `id=${issueId}`)
            .then(data => ({ success: data.changedRows ? true : false }))
            .catch(err => ({ success: false, message: err.sqlMessage }));
    
        if(result.success) {
            return this.getSingleIssue(projectId, issueId);
        }

        return result;
    }

    async removeIssue(projectId, issueId) {
        const result = await db.removeRecords("issues", `id=${issueId}`)
            .then(data => ({ success: data.affectedRows ? true : false }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

}

module.exports = new Issue;