const Table = require('./Table');

class Projects {
    constructor() {
        this.table = new Table("projects");
    }

    createProject(newProject, creatorId) {
        return this.table.createEntry({ ...newProject, creatorId })
    }

    getSingleProject(projectId) {
        const columns = ["projects.id", "projects.name", "projects.description", "users.userName as creator"];
        const joinOptions = {
            joinTable: "users",
            joinColumns: "projects.creatorId = users.id"
        }
        return this.table.getEntry(columns, `projects.id=${projectId}`, joinOptions);
    }

    getProjectsByUserId(userId) {
        const columns = ["projects.id", "projects.name", "projects.description", "users.userName as creator"];
        const joinOptions = [{
            joinTable: "users",
            joinColumns: "projects.creatorId = users.id"
        }, {
            joinTable: "project_collaborators pc",
            joinColumns: "pc.projectId = projects.id"
        }];
        return this.table.getEntrys(columns, `pc.collaboratorId=${userId}`, joinOptions);
    }

    updateProject(projectId, updateObject) {
        return this.table.updateEntrys(`id=${projectId}`, updateObject);
    }

    removeProject(projectId) {
        return this.table.removeEntrys(`id=${projectId}`);
    }

}

module.exports = new Projects;