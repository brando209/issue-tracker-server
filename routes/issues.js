const express = require('express');
const router = express.Router();

const db = require('../database/Database');
const authorizeJWT = require('../middlewares/authorization');

router.post('/new', authorizeJWT, async (req, res) => {
    const projectId = res.locals.params.projectId;
    const result = await db.addIssue(req.body, projectId, req.user.id);
    if(!result.success) return res.status(400).send(result);
    return res.status(200).send(result);
});

router.get('/:issueId', authorizeJWT, async (req, res) => {
    const projectId = res.locals.params.projectId;
    const issue = await db.getIssue(projectId, req.params.issueId);
    if(!issue) return res.status(404).send({ success: false, message: "Issue does not exist" });
    return res.status(200).send({ success: true, message: "Issue retrieved successfully", issue: issue });
});

router.patch('/:issueId', authorizeJWT, async (req, res) => {
    const projectId = res.locals.params.projectId;
    const patchedIssue = await db.updateIssue(projectId, req.params.issueId, req.body);
    if(!patchedIssue)  return res.status(400).send({ success: false, message: "Issue not updated" });
    return res.status(200).send({ success: true, message: "Issue updated successfully" });
});

router.delete('/:issueId', authorizeJWT, async (req, res) => {
    const projectId = res.locals.params.projectId;
    const deletedIssue = await db.deleteIssue(projectId, req.params.issueId);
    if(!deletedIssue)  return res.status(400).send({ success: false, message: "Issue not deleted" });
    return res.status(200).send({ success: true, message: "Issue deleted successfully" });
});

module.exports = router;