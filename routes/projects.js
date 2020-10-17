const express = require('express');
const router = express.Router();

const db = require('../database/Database');
const authorizeJWT = require('../middlewares/authorization');
const issueRouter = require('./issues');
const { passRouteParams } = require('./utils');

router.post('/new', authorizeJWT, async (req, res) => {
    const newProjectId = await db.createProject(req.body.project, req.user.id);
    if(!newProjectId) return res.status(404).send({ success: false, message: "Project not created" });
    return res.status(200).send({ success: true, message: "Project successfully created", projectId: newProjectId });
});

router.get('/:projectId', authorizeJWT, async (req, res) => {
    const project = await db.getProject(req.params.projectId);
    if (!project) return res.status(404).send({ success: false, message: "Project not found" });
    return res.status(200).send({ success: true, project: project });
});

router.patch('/:projectId', authorizeJWT, async (req, res) => {
    const updated = await db.updateProject(req.params.projectId, req.body);
    if (!updated) return res.status(404).send({ success: false, message: "Project not updated" });
    return res.status(200).send({ success: true, message: "Project successfully updated" });
});

router.delete('/:projectId', authorizeJWT, async (req, res) => {
    const deleted = await db.deleteProject(req.params.projectId);
    if (!deleted) return res.status(404).send({ success: false, message: "Project not deleted" });
    return res.status(200).send({ success: true, message: "Project successfully deleted" });
});

router.use('/:projectId/issues/', passRouteParams, issueRouter);


module.exports = router;