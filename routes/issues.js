const express = require('express');
const router = express.Router();

const db = require('../database/Database');
const authorizeJWT = require('../middlewares/authorization');

router.post('/new', authorizeJWT, async (req, res) => {
    const projectId = res.locals.params.projectId;
    const result = await db.addIssue(req.body, projectId, req.user.id);
    if(!result.success) return res.status(400).send({ message: "Issue not created", ...result });
    return res.status(200).send({ message: "Issue created successfully", ...result });
});

router.get('/:issueId', authorizeJWT, async (req, res) => {
    const projectId = res.locals.params.projectId;
    const result = await db.getIssue(projectId, req.params.issueId);
    if(!result.success) return res.status(404).send({ message: "Issue does not exist", ...result });
    return res.status(200).send({ message: "Issue retrieved successfully", ...result });
});

router.patch('/:issueId', authorizeJWT, async (req, res) => {
    const projectId = res.locals.params.projectId;
    const result = await db.updateIssue(projectId, req.params.issueId, req.body);
    if(!result.success)  return res.status(400).send({ message: "Issue not updated", ...result });
    return res.status(200).send({ message: "Issue updated successfully", ...result });
});

router.delete('/:issueId', authorizeJWT, async (req, res) => {
    const projectId = res.locals.params.projectId;
    const result = await db.deleteIssue(projectId, req.params.issueId);
    if(!result.success)  return res.status(400).send({ message: "Issue not deleted", ...result });
    return res.status(200).send({ message: "Issue deleted successfully", ...result });
});

module.exports = router;