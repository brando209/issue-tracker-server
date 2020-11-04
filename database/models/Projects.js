const db = require('../Database');
const { makeUpdateArray } = require('../utils');

class Projects {

    async createProject(newProject, creatorId) {
        const result = await db.addRecord("projects", { ...newProject, creatorId })
            .then(data => ({ success: true, projectId: data.insertId }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async getSingleProject(projectId) {
        const columns = ["projects.id", "projects.name", "projects.description", "users.userName as creator"];
        const joinOptions = {
            joinTable: "users",
            joinColumns: "projects.creatorId = users.id"
        }

        const result = await db.query("projects", columns, `projects.id=${projectId}`, "*", joinOptions)
            .then(data => ({ success: data.length > 0 ? true : false, project: data[0] }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async updateProject(projectId, updateObject) {
        const result = await db.updateRecords("projects", makeUpdateArray(updateObject), `id=${projectId}`)
            .then(data => ({ success: data.changedRows ? true : false }))
            .catch(err => ({ success: false, message: err.sqlMessage }));

        return result;
    }

    async removeProject(projectId) {
        const projectDeleted = await db.removeRecords("projects", `id=${projectId}`)
            .then(data => ({ success: data.affectedRows ? true : false }))
            .catch(err => ({ success: false, message: err.sqlMessage }));
        return projectDeleted;
    }

}

module.exports = new Projects;