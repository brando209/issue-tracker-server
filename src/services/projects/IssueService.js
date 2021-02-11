const { Projects, Issues, Comments } = require('../../database/models');
const { currentDatetime } = require('../utils');
class IssueService {

    async createIssue(projectId, creatorId, issue) {
        const issueCreated = await Issues.createIssue(issue, projectId, creatorId);
        if (!issueCreated.success) throw new Error(issueCreated.message);
        return this.getIssueDetails(projectId, issueCreated.id);
    }

    async getIssueDetails(projectId, issueId) {
        const issueRecord = await Issues.getSingleIssue(projectId, issueId);
        if (!issueRecord.success) throw new Error("Unable to retrieve issue details");
        return issueRecord.data;
    }

    async getAllIssues(projectId) {
        const issues = await Issues.getAllIssues(projectId);
        if (!issues.success) throw new Error("Unable to retrieve issue details");
        return issues.data;
    }

    async updateIssueDetails(projectId, issueId, details) {
        const issueUpdated = await Issues.updateIssue(projectId, issueId, details);
        if (!issueUpdated.success) throw new Error("Unable to update issue details");
        return this.getIssueDetails(projectId, issueId);
    }

    async removeIssue(projectId, issueId) {
        const issueRemoved = await Issues.removeIssue(projectId, issueId);
        if (!issueRemoved.success) throw new Error("Unable to remove issue");
        return issueRemoved.data;
    }

    async assignIssue(projectId, issueId, userId) {
        const issueAssigned = await Issues.updateIssue(projectId, issueId, { assigneeId: userId, status: "open", opened_at: currentDatetime() });
        if (!issueAssigned.success) throw new Error("Unable to assign issue to user");
        
        const issue = await Issues.getSingleIssue(projectId, issueId);
        return issue.data;
    }

    async advanceIssue(projectId, issueId, userId, status) {
        let issueRecord = await Issues.getSingleIssue(projectId, issueId);
        if(!issueRecord.success) throw new Error(issueRecord.message);
        
        const issue = issueRecord.data;
        if(issue.assineeId !== userId && issue.creatorId !== userId) throw new Error("User not allowed to advance issue");
        
        const update = { status: status };
        (status === "inprogress") ? update.started_at = currentDatetime() : update.closed_at = currentDatetime();
        
        const issueUpdated = await Issues.updateIssue(projectId, issueId, update);
        if(!issueUpdated.success) throw new Error("Unable to advance issue");

        issueRecord = await Issues.getSingleIssue(projectId, issueId);

        return issueRecord.data;
    }

    async addComment(projectId, issueId, userId, commentBody) {
        const added = await Comments.addComment(projectId, issueId, userId, commentBody);
        if(!added.success) throw new Error("Unable to add new comment");
        const comment = await Comments.getComment(projectId, issueId, added.id);
        return comment.data;
    }

    async removeComment(projectId, issueId, commentId) {
        const comment = await Comments.removeComment(projectId, issueId, commentId);
        return comment.data;
    }

    async getComment(projectId, issueId, commentId) {
        const comment = await Comments.getComment(projectId, issueId, commentId);
        return comment.data;
    }

    async getIssueComments(projectId, issueId) {
        const comment = await Comments.getAllIssueComments(projectId, issueId);
        return comment.data;
    }
}

module.exports = new IssueService;