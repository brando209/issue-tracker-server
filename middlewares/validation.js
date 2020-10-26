const validator = require('../helpers/validate');

const register = (req, res, next) => {
    const validationRule = {
        "firstName": "required|string",
        "lastName": "required|string",
        "userName": "required|string",
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


module.exports = { 
  register, signin
}