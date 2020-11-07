const express = require('express');
const router = express.Router();

const Projects = require('../database/models/Projects');
const authorizeJWT = require('../middlewares/authorization');

const issueRouter = require('./issues');
const { passRouteParams } = require('./utils');

router.post('/new', authorizeJWT, async (req, res) => {
    const result = await Projects.createProject(req.body, req.user.id);
    if(!result.success) return res.status(400).send({ message: "Project not created", ...result });
    return res.status(200).send({ message: "Project successfully created", ...result });
});

router.get('/', authorizeJWT, async (req, res) => {
    const result = await Projects.getProjectsByUserId(req.user.id);
    if (!result.success) return res.status(404).send({ message: "Project(s) not found", ...result });
    return res.status(200).send({ message: "Project(s) successfully retrieved", ...result });                  
});

router.get('/:projectId', authorizeJWT, async (req, res) => {
    const result = await Projects.getSingleProject(req.params.projectId);
    if (!result.success) return res.status(404).send({ message: "Project not found", ...result });
    return res.status(200).send({ message: "Project successfully retrieved", ...result });
});

router.patch('/:projectId', authorizeJWT, async (req, res) => {
    const result = await Projects.updateProject(req.params.projectId, req.body);
    if (!result) return res.status(404).send({ message: "Project not updated", ...result });
    return res.status(200).send({ message: "Project successfully updated", ...result });
});

router.delete('/:projectId', authorizeJWT, async (req, res) => {
    const result = await Projects.removeProject(req.params.projectId);
    if (!result.success) return res.status(404).send({ message: "Project not deleted", ...result });
    return res.status(200).send({ message: "Project successfully deleted", ...result });
});

router.post('/:projectId/addCollaborator', async (req, res) => {
    const result = await Projects.addProjectCollaborator(req.params.projectId, req.body.collaboratorId);
    if (!result.success) return res.status(404).send({ message: "Collaborator not added to project", ...result });
    return res.status(200).send({ message: "Collaborator successfully added to project", ...result });
});

router.post('/:projectId/removeCollaborator', async (req, res) => {
    const result = await Projects.removeProjectCollaborator(req.params.projectId, req.body.collaboratorId);
    if (!result.success) return res.status(404).send({ message: "Collaborator not removed from project", ...result });
    return res.status(200).send({ message: "Collaborator successfully removed from project", ...result });
});

router.use('/:projectId/issues/', passRouteParams, issueRouter);

module.exports = router;