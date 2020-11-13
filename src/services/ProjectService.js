const { Projects, Users, Collaborators } = require('../database/models');
const Issues = require('../database/models/Issues');

class ProjectService {

    async createProject(project, userId) {
        const projectCreated = await Projects.createProject(project, userId);
        if (!projectCreated.success) throw new Error("Project not created");
        await this.addCollaborator(projectCreated.id, userId);
        return this.getProjectDetails(projectCreated.id);
    }

    async getProjectDetails(projectId) {
        const projectRecord = await Projects.getSingleProject(projectId);
        if (!projectRecord.success) throw new Error("Unable to retrieve project record");
        return projectRecord.data;
    }

    async getProjectsByUser(userId) {
        const projectRecords = await Projects.getProjectsByUserId(userId);
        if (!projectRecords.success) throw new Error("Unable to retrieve project record(s)");
        return projectRecords.data;
    }

    async changeProjectDetails(projectId, newDetails) {
        const projectChanged = await Projects.updateProject(projectId, newDetails);
        if(!projectChanged.success) throw new Error("Unable to update project information");
        return this.getProjectDetails(projectId);
    }

    async removeProject(projectId) {
        const projectRemoved = await Projects.removeProject(projectId);
        if(!projectRemoved.success) throw new Error("Unable to remove project record");
        return projectRemoved.data;
    }

    async addCollaborator(projectId, collaboratorId) {
        const collabAdded = await Collaborators.addProjectCollaborator(projectId, collaboratorId);
        if (!collabAdded.success) throw new Error("User not added as collaborator");
    }

    async removeCollaborator(projectId, collaboratorId) {
        const collabRemoved = await Collaborators.removeProjectCollaborator(projectId, collaboratorId);
        if (!collabRemoved.success) throw new Error("User not removed from collaborators");
    }

    async getCollaborators(projectId) {
        const collaborators = await Collaborators.getAllProjectCollaborators(projectId);
        if(!collaborators.success) throw new Error("Unable to retrieve project collaborators");
        return collaborators.data;
    }

    async assignIssue(projectId, issueId, userId) {
        const issueAssigned = await Issues.updateIssue(projectId, issueId, { assigneeId: userId });
        if(!issueAssigned.success) throw new Error("Unable to assign issue to user");
        return issueAssigned.data;
    }



}

module.exports = new ProjectService;