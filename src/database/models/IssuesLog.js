const Table = require('./Table');

class IssuesLog {
    constructor() {
        this.table = new Table("projects_log");
    }

    getIssueLog(projectId, issueId) {
        return this.table.getEntry("*", `issueId=${issueId}`);
    }

}

module.exports = new IssuesLog;