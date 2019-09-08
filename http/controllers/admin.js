const UsersModel = require('../../models/UsersModel');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const config = require('../../config/config');

function createToken (body) {
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
    async resPage (req, res) {
        try {
            let users = await UsersModel.find({});
            res.status(200).json(users);
        } catch (e) {
            res.status(500).send('Ошибка сервера');
            console.log(e)
        }

    },
    async getUserAdminMessages (req, res) {
        try {
            let userMessages = await UsersModel.findOne({chatId: req.params.chatId});
            res.json(userMessages);
        } catch (e) {
            console.log(e)
        }
    }
};