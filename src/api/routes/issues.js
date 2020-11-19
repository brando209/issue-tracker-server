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
        return res.status(200).send({ success: true, message: "Issue created successfully", issue });
    } catch (err) {
        return res.status(400).send({ success: false, message: err.message });
    }
});

router.get('/', async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        const issues = await IssueService.getAllIssues(projectId);
        return res.status(200).send({ success: true, message: "Issue(s) retrieved successfully", issues });
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message });
    }
});

router.get('/:issueId', async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        const issue = await IssueService.getIssueDetails(projectId, req.params.issueId)
        return res.status(200).send({ success: true, message: "Issue retrieved successfully", issue });
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message });
    }
});

router.patch('/:issueId/assign', async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        const issue = await IssueService.assignIssue(projectId, req.params.issueId, req.query.userId);
        return res.status(200).send({ success: true, message: "Issue successfully assigned to user", issue });
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message });
    }

});

router.patch('/:issueId/advance', async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        const issue = await IssueService.advanceIssue(projectId, req.params.issueId, req.user.id, req.query.status);
        return res.status(200).send({ success: true, message: "Issue advanced successfully", issue: issue });
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message });
    }
});

router.patch('/:issueId', validation.changeIssue, async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        const updateIssue = await IssueService.updateIssueDetails(projectId, req.params.issueId, req.body);
        return res.status(200).send({ success: true, message: "Issue updated successfully", issue: updateIssue });
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message });
    }
});

router.delete('/:issueId', async (req, res) => {
    const projectId = res.locals.params.projectId;
    try {
        await IssueService.removeIssue(projectId, req.params.issueId);
        return res.status(200).send({ success: true, message: "Issue removed successfully" });
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message });
    }
});

module.exports = router;