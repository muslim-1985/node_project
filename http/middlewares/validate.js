const {check} = require('express-validator');

module.exports = {
    validateRegister() {
        return [
            check('username').not().isEmpty().isLength({min: 5}).withMessage('Name must have more than 5 characters'),
            check('email', 'Your email is not valid').not().isEmpty().isEmail().normalizeEmail(),
            check('password', 'Your password must be at least 5 characters').not().isEmpty().isLength({min: 6})
        ]
    },
    validateLogin() {
        return [
            check('username').not().isEmpty().isLength({min: 5}).withMessage('Name must have more than 5 characters'),
            check('password', 'Your password must be at least 5 characters').not().isEmpty().isLength({min: 6})
        ]
    },
    validateRoles() {
        return [
            check('name').not().isEmpty().trim().escape(),
            check('permissions').isArray(),
            check('permissions.*.role').trim().escape(),
            check('permissions.*.routes').trim().escape(),
        ]
    }
};