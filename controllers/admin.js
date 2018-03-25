const UsersModel = require('../models/UsersModel');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

function createToken (body) {
    return jwt.sign(
        body,
        config.app.jwt.secretOrKey,
        {expiresIn: '1h'}
    );
}

module.exports = {
    async resPage (req, res) {
        res.render('admin.html', { username: req.user.username });
    },
    async login (req, res) {
        try {
            let user = await UsersModel.findOne({username: {$regex: _.escapeRegExp(req.body.username), $options: "i"}}).lean().exec();
            if(user != void(0) && bcrypt.compareSync(req.body.password, user.password)) {
                const token = createToken({id: user._id, username: user.username});
                // res.cookie('token', token, {
                //     httpOnly: true
                // });
                console.log(token);

                res.json({authorization: 'Bearer'+ ' '+token, message: "User login success."});
                //res.status(200).send({message: "User login success."});
            } else res.status(400).send({message: "User not exist or password not correct"});
        } catch (e) {
            console.error("E, login,", e);
            res.status(500).send({message: "some error"});
        }
    },

    async register(req, res) {
        try {
            let user = await UsersModel.findOne({username: {$regex: _.escapeRegExp(req.body.username), $options: "i"}}).lean().exec();
            if(user != void(0)) return res.status(400).send({message: "Пользователь уже зарегестрирован в системе"});
            //проверяем повторение пароля
            if(req.body.password !== req.body.forgotPass) return res.status(400).send({message: "Ваши пароли не совпадают"});
            //создаем юзера
            user = await UsersModel.create({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            });

            const token = createToken({id: user._id, username: user.username});

            // res.cookie('token', token, {
            //     httpOnly: true
            // });
            return res.json({authorization: 'Bearer'+ ' ' +token, message: "User created."});

            //res.status(200).send({message: "User created."});

        } catch (e) {
            console.error("E, register,", e);
            res.status(500).send({message: "some error"});
        }
    }
};