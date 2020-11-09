const Table = require('./Table');

class Collaborators {
    constructor() {
        this.table = new Table("project_collaborators");
    }

    async addProjectCollaborator(projectId, collaboratorId) {
        return this.table.createEntry({ projectId, collaboratorId });
    }

    async removeProjectCollaborator(projectId, collaboratorId) {
        return this.table.removeEntrys([`projectId='${projectId}' AND collaboratorId='${collaboratorId}'`]);
    }

    async getSingleProjectCollaborator(projectId, collaboratorId) {     
        return this.table.getEntry("*", [`projectId='${projectId}' AND collaboratorId='${collaboratorId}'`]);
    }

    async getAllProjectCollaborators(projectId) {
        return this.table.getEntrys("collaboratorId", `projectId=${projectId}`);
    }

}

module.exports = new Collaborators;