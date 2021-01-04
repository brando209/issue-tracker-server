const express = require('express');
const router = express.Router();

const ProjectService = require('../../services/projects/ProjectService');
const authorization = require('../middlewares/authorization');
const validation = require('../middlewares/validation');

const issueRouter = require('./issues');
const { passRouteParams } = require('./utils');

router.use(authorization.authorizeJWT);

router.post('/', validation.createProject, async (req, res) => {
    try {
        const project = await ProjectService.createProject(req.body, req.user.id);
        return res.status(200).send(project);
    } catch(err) {
        return res.status(400).send({ error: true, message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const projects = await ProjectService.getProjectsByUser(req.user.id);
        return res.status(200).send(projects);
    } catch(err) {
        return res.status(400).send({ error: true, message: err.message });
    }
})

router.get('/:projectId', async (req, res) => {
    try {
        const project = await ProjectService.getProject(req.params.projectId);
        return res.status(200).send(project);
    } catch(err) {
        return res.status(400).send({ error: true, message: err.message });
    }
});

router.patch('/:projectId', validation.changeProject, async (req, res) => {
    try {
        const updatedProject = await ProjectService.changeProjectDetails(req.params.projectId, req.body);
        return res.status(200).send(updatedProject);
    } catch(err) {
        return res.status(400).send({ error: true, message: err.message });
    }
});

router.delete('/:projectId', async (req, res) => {
    try {
        await ProjectService.removeProject(req.params.projectId);
        return res.sendStatus(200);
    } catch(err) {
        return res.status(400).send({ error: true, message: err.message });
    }
});

router.get('/:projectId/collaborators', async (req, res) => {
    try {
        const collaborators = await ProjectService.getCollaborators(req.params.projectId);
        return res.status(200).send(collaborators);
    } catch(err) {
        return res.status(400).send({ error: true, message: err.message });
    }
});

router.post('/:projectId/collaborators', async (req, res) => {
    try {
        await ProjectService.addCollaborator(req.params.projectId, req.body.collaboratorId);
        return res.sendStatus(200);
    } catch (err) {
        return res.status(400).send({ error: true, message: err.message });
    }
});

router.delete('/:projectId/collaborators', async (req, res) => {
    try {
        await ProjectService.removeCollaborator(req.params.projectId, req.body.collaboratorId);
        return res.sedStatus(200);
    } catch (err) {
        return res.status(400).send({ error: true, message: err.message });
    }
});

router.use('/:projectId/issues/', passRouteParams, issueRouter);

module.exports = router;