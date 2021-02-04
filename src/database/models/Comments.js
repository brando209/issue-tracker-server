const Table = require('./Table');

class Comments {
    constructor() {
        this.table = new Table("comments");
    }

    async addComment(projectId, issueId, userId, comment) {
        console.log(comment);
        return this.table.createEntry({ body: comment, creatorId: userId, issueId });
    }

    async removeComment(projectId, issueId, commentId) {
        return this.table.removeEntrys([`issueId='${issueId}' AND id='${commentId}'`]);
    }

    async getComment(projectId, issueId, commentId) {     
        return this.table.getEntry("*", [`issueId='${issueId}' AND id='${commentId}'`]);
    }

    async getAllIssueComments(projectId, issueId) {
        return this.table.getEntrys("*", `issueId=${issueId}`);
    }

}

module.exports = new Comments;