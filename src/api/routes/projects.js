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
        return res.status(200).send({ success: true, message: "Project successfully created", project });
    } catch(err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const projects = await ProjectService.getProjectsByUser(req.user.id);
        return res.status(200).send({success: true, message: "Project(s) successfully retrieved", projects });
    } catch(err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.get('/:projectId', async (req, res) => {
    try {
        const project = await ProjectService.getProject(req.params.projectId);
        return res.status(200).send({success: true, message: "Project successfully retrieved", project });
    } catch(err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.patch('/:projectId', validation.changeProject, async (req, res) => {
    try {
        const updatedProject = await ProjectService.changeProjectDetails(req.params.projectId, req.body);
        return res.status(200).send({success: true, message: "Project successfully updated", project: updatedProject });
    } catch(err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.delete('/:projectId', async (req, res) => {
    try {
        await ProjectService.removeProject(req.params.projectId);
        return res.status(200).send({success: true, message: "Project successfully removed" });
    } catch(err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.get('/:projectId/collaborators', async (req, res) => {
    try {
        const collaborators = await ProjectService.getCollaborators(req.params.projectId);
        return res.status(200).send({success: true, message: "Project collaborators successfully retrieved", collaborators });
    } catch(err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.post('/:projectId/collaborators', async (req, res) => {
    try {
        await ProjectService.addCollaborator(req.params.projectId, req.body.collaboratorId);
        return res.status(200).send({ success: true, message: "Collaborator successfully added to project" });
    } catch (err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.delete('/:projectId/collaborators', async (req, res) => {
    try {
        await ProjectService.removeCollaborator(req.params.projectId, req.body.collaboratorId);
        return res.status(200).send({ success: true, message: "Collaborator successfully removed from project" });
    } catch (err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.use('/:projectId/issues/', passRouteParams, issueRouter);

module.exports = router;