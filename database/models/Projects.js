class Projects {
    makeSqlQuery;
    constructor(makeSqlQuery) {
        this.makeSqlQuery = makeSqlQuery;
    }

    async create(newProject, creatorId) {
        const sqlQuery = "INSERT INTO projects (name, description, creatorId) VALUES (?)";
        const values = [newProject.name, newProject.description, creatorId];
        const newProjectId = await this.makeSqlQuery(sqlQuery, [values]).then(data => data.insertId);
        return newProjectId;
    }

    async get(projectId) {
        const sqlQuery = `
        SELECT p.id, p.name, p.description, u.userName as creator 
        FROM projects p 
        INNER JOIN users u 
        ON p.creatorId = u.id 
        WHERE p.id = ?`;
        const project = await this.makeSqlQuery(sqlQuery, projectId).then(data => data[0]).catch(err => new Error("Error accessing database"));
        return project ? project : null;
    }

    async update(projectId, updateObject) {
        // Create string argument for SET clause of update query
        let updates = "";
        for(let key of Object.keys(updateObject)) { updates += `${key} = '${updateObject[key]}', ` }
        updates = updates.substring(0, updates.length - 2); //remove last comma

        const sqlQuery = `UPDATE projects SET ${updates} WHERE id = ?`;
        const projectUpdated = await this.makeSqlQuery(sqlQuery, projectId).then(data => data.changedRows).catch(err => false);
        return projectUpdated;
    }

    async delete(projectId) {
        const sqlqQery = "DELETE FROM projects WHERE id = ?";
        const projectDeleted = await this.makeSqlQuery(sqlqQery, projectId).then(data => data.affectedRows).catch(err => false);
        return projectDeleted;
    }
}

module.exports = Projects;