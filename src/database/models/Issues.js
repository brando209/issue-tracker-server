const Table = require('./Table');

class Issue { 
    constructor() {
        this.table = new Table("issues");
    }

    createIssue(issue, projectId, creatorId) {
        return this.table.createEntry({ ...issue, creatorId, projectId }, creatorId);
    }

    getSingleIssue(projectId, issueId) {
        return this.table.getEntry("*", `id=${issueId}`);
    }

    getAllIssues(projectId) {
        const joinOptions = { joinTable: "projects", joinColumns: `issues.projectId = projects.id`}
        return this.table.getEntrys("issues.*", `issues.projectId=${projectId}`, joinOptions);
    }

    updateIssue(projectId, issueId, updateObject, actorId = null) {
        const result = this.table.updateEntrys( `id=${issueId}`, updateObject, actorId)
        if(result.success) {
            return this.table.getEntry("*", `id=${issueId}`);
        }
        return result;
    }

    removeIssue(projectId, issueId, actorId = null) {
        return this.table.removeEntrys(`id=${issueId}`, actorId);
    }

}

module.exports = new Issue;