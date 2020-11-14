const { Projects, Issues, Collaborators } = require('../../database/models');

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
        const issueAssigned = await Issues.updateIssue(projectId, issueId, { assigneeId: userId });
        if (!issueAssigned.success) throw new Error("Unable to assign issue to user");
        return issueAssigned.data;
    }

}

module.exports = new IssueService;