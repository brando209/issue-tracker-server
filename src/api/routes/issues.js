const express = require('express');
const router = express.Router();

const IssueService = require('../../services/projects/IssueService');
const authorization = require('../middlewares/authorization');
const validation = require('../middlewares/validation');

router.use(authorization.authorizeJWT);

router.post('/', validation.createIssue, async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        const issue = await IssueService.createIssue(projectId, req.user.id, req.body);
        return res.status(200).send(issue);
    } catch (err) {
        return res.status(400).send({ error: true, message: err.message });
    }
});

router.get('/', async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        const issues = await IssueService.getAllIssues(projectId);
        return res.status(200).send(issues);
    } catch (err) {
        return res.status(404).send({ error: true, message: err.message });
    }
});

router.get('/:issueId', async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        const issue = await IssueService.getIssueDetails(projectId, req.params.issueId)
        return res.status(200).send(issue);
    } catch (err) {
        return res.status(404).send({ error: true, message: err.message });
    }
});

router.patch('/:issueId/assign', async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        const issue = await IssueService.assignIssue(projectId, req.params.issueId, req.body.assigneeId);
        return res.status(200).send(issue);
    } catch (err) {
        return res.status(404).send({ error: true, message: err.message });
    }
});

router.patch('/:issueId/advance', async (req, res) => {
    const projectId = res.locals.params.projectId;
    console.log(req.body);
    try {
        const issue = await IssueService.advanceIssue(projectId, req.params.issueId, req.user.id, req.body.status);
        return res.status(200).send(issue);
    } catch (err) {
        console.log(err);
        return res.status(404).send({ error: true, message: err.message });
    }
});

router.patch('/:issueId', validation.changeIssue, async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        const updateIssue = await IssueService.updateIssueDetails(projectId, req.params.issueId, req.body);
        return res.status(200).send(updateIssue);
    } catch (err) {
        return res.status(404).send({ error: true, message: err.message });
    }
});

router.delete('/:issueId', async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        await IssueService.removeIssue(projectId, req.params.issueId);
        return res.sendStatus(200);
    } catch (err) {
        return res.status(404).send({ error: true, message: err.message });
    }
});

router.get('/:issueId/comments', async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        const comments = await IssueService.getIssueComments(projectId, req.params.issueId);
        return res.status(200).send(comments);
    } catch (err) {
        return res.status(400).send({ error: true, message: err.message });
    }
});

router.post('/:issueId/comments', async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        const comment = await IssueService.addComment(projectId, req.params.issueId, req.user.id, req.body.comment);
        return res.send(comment);
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: true, message: err.message });
    }
});

module.exports = router;