const validator = require('../../helpers/validate');

const register = (req, res, next) => {
    const validationRule = {
        "firstName": "required|string|min:3|max:20",
        "lastName": "required|string|min:3|max:20",
        "userName": "required|string|min:3|max:20",
        "email": "required|email",
        "password": "required|string|min:6",
    }

    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({ success: false, message: 'Validation failed', data: err });
        } else {
            next();
        }
    });
}

const signin = (req, res, next) => {
    const validationRule = {
        "userName": "required_without:email|string",
        "email": "required_without:userName|email",
        "password": "required|string|min:6",
    }

    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({ success: false, message: 'Validation failed', data: err });
        } else {
            next();
        }
    });
}

const createProject = (req, res, next) => {
    const validationRule = {
        "name": "required|string|min:3|max:20",
        "description": "required|string|min:3|max:255"
    }

    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({ success: false, message: 'Validation failed', data: err });
        } else {
            next();
        }
    });
}

const changeProject = (req, res, next) => {
    const validationRule = {
        "name": "sometimes|string|min:3|max:20",
        "description": "sometimes|string|min:3|max:255"
    }

    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({ success: false, message: 'Validation failed', data: err });
        } else {
            next();
        }
    });
}

const createIssue = (req, res, next) => {
    const validationRule = {
        "title": "required|string|min:3|max:20",
        "description": "required|string|min:3|max:255",
        "category": "sometimes|in:bug,feature,task,other",
        "priority": "sometimes|in:trivial,low,regular,high,critical"
    }

    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({ success: false, message: 'Validation failed', data: err });
        } else {
            next();
        }
    });
}

const changeIssue = (req, res, next) => {
    const validationRule = {
        "title": "sometimes|string|min:3|max:20",
        "description": "sometimes|string|min:3|max:255",
        "category": "sometimes|in:bug,feature,task,other",
        "priority": "sometimes|in:trivial,low,regular,high,critical"
    }

    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({ success: false, message: 'Validation failed', data: err });
        } else {
            next();
        }
    });
}

module.exports = { 
  register, signin, createProject, changeProject, createIssue, changeIssue
}