const { Projects, Issues, Collaborators } = require('../../database/models');

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

    async getProject(projectId) {
        const projectRecord = await this.getProjectDetails(projectId);
        const issues = await Issues.getAllIssues(projectId);
        return { ...projectRecord, issues };
    }

    async getProjectsByUser(userId) {
        const projectRecords = await Projects.getProjectsByUserId(userId);
        if (!projectRecords.success) throw new Error("Unable to retrieve project record(s)");

        const projects = [];
        for(let i = 0; i < projectRecords.data.length; i++) {
            const issues = await Issues.getAllIssues(projectRecords.data[i].id);
            projects.push({ ...projectRecords.data[i], issues });
        }

        return projects;
    }

    async changeProjectDetails(projectId, newDetails) {
        const projectChanged = await Projects.updateProject(projectId, newDetails);
        if (!projectChanged.success) throw new Error("Unable to update project information");
        return this.getProjectDetails(projectId);
    }

    async removeProject(projectId) {
        const projectRemoved = await Projects.removeProject(projectId);
        if (!projectRemoved.success) throw new Error("Unable to remove project record");
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
        if (!collaborators.success) throw new Error("Unable to retrieve project collaborators");
        return collaborators.data;
    }

}

module.exports = new ProjectService;