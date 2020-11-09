const Table = require('./Table');

class Issue { 
    constructor() {
        this.table = new Table("issues");
    }

    createIssue(issue, projectId, creatorId) {
        return this.table.createEntry({ ...issue, creatorId, projectId });
    }

    getSingleIssue(projectId, issueId) {
        return this.table.getEntry("*", `id=${issueId}`);
    }

    getAllIssues(projectId) {
        const joinOptions = { joinTable: "projects", joinColumns: `issues.projectId = projects.id`}
        return this.table.getEntrys("issues.*", `issues.projectId=${projectId}`, joinOptions);
    }

    updateIssue(projectId, issueId, updateObject) {
        const result = this.table.updateEntrys( `id=${issueId}`, updateObject)
    
        if(result.success) {
            return this.getSingleIssue(projectId, issueId);
        }

        return result;
    }

    removeIssue(projectId, issueId) {
        return this.table.removeEntrys(`id=${issueId}`);
    }

}

module.exports = new Issue;