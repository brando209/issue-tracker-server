const db = require('../Database');

class ProjectCollaborators {

    async addProjectCollaborator(projectId, collaboratorId) {
        const result = await db.addRecord("project_collaborators", { projectId, collaboratorId })
            .then(data => ({ success: true }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async removeProjectCollaborator(projectId, collaboratorId) {
        const result = await db.removeRecords("project_collaborators", [`projectId='${projectId}'`, `collaboratorId='${collaboratorId}'`])
            .then(data => ({ success: true }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async isProjectCollaborator(projectId, collaboratorId) {
        const result = await db.query("project_collaborators", "*", [`projectId=${projectId}`, `collaboratorId=${collaboratorId}`])
            .then(data => data.length > 0 ? true : false)
            .catch(err => ({ success: false, message: err.sqlMessage }));
    }

}