const UsersModel = require('../../models/UsersModel');
const RolesModel = require('../../models/RolesPermissonsModel');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const config = require('../../config/config');

function createToken(body) {
    return jwt.sign(
        body,
        config.app.jwt.secretOrKey,
        {expiresIn: '7h'}
    );
}

function validateErr(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    }
    return false;
}

module.exports = {
    async login(req, res) {
        if (validateErr(req, res)) {
            return validateErr(req, res)
        }
        try {
            let user = await UsersModel.findOne({
                username: {
                    $regex: _.escapeRegExp(req.body.username),
                    $options: "i"
                }
            }).lean().exec();
            if (user != void (0) && bcrypt.compareSync(req.body.password, user.password)) {
                const token = createToken({id: user._id, username: user.username});
                res.json({message: "User login success", userId: user._id, token});
            } else res.status(400).send({message: "User not exist or password not correct"});
        } catch (e) {
            console.error("E, login,", e);
            res.status(500).send({message: "some error"});
        }
    },

    async register(req, res) {
        if (validateErr(req, res)) {
            return validateErr(req, res)
        }
        try {
            let user = await UsersModel.findOne({
                username: {
                    $regex: _.escapeRegExp(req.body.username),
                    $options: "i"
                }
            }).lean().exec();
            if (user != void (0)) return res.status(400).send({message: "Пользователь уже зарегестрирован в системе"});
            let {username, password, email, roles} = req.body;
            user = await UsersModel.create({
                username,
                password,
                email,
                roles
            });

            const token = createToken({id: user._id, username: user.username});

            res.json({message: "ok", userId: user._id, token});

        } catch (e) {
            console.error("E, register,", e);
            res.status(500).send({message: "some error"});
        }
    },
    async createRole(req, res) {
        if (validateErr(req, res)) {
            return validateErr(req, res)
        }
        let {name, permissions} = req.body;
        let role = await RolesModel.findOne({name});
        if (role != void(0)) {
            return res.status(400).send({message: "Role exist"});
        }
        role = await RolesModel.create({
            name, permissions
        });
        return res.status(200).send({message: role});
    }
};