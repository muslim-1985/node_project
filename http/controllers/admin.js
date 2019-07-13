const {User} = require('../../sequalize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config/config');
const {validationResult} = require('express-validator/check');
// const Redis = require('ioredis');
// const redis = new Redis();

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
    async resPage(req, res) {
        try {
            let users = await User.findAll({});
            res.status(200).json(users);
        } catch (e) {
            res.status(500).send('Ошибка сервера');
            console.log(e)
        }
    },
    async login(req, res) {
        if (validateErr(req, res)) {
            return validateErr(req, res)
        }
        try {
            let user = await User.findOne({where: {name: req.body.username}});
            let {id, username, password} = user;

            if (user != void (0) && bcrypt.compareSync(req.body.password, password)) {
                const token = createToken({id, username});
                res.json({message: "User login success", userId: id, token});
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
            let user = await User.findOne({where: {name: req.body.username}});
            if (user != void (0)) return res.status(400).send({message: "User is already registered in the system."});
            if (req.body.password !== req.body.repeatPassword) return res.status(400).send({message: "Passwords do not match"});
            let pass = await bcrypt.hash(req.body.password, 12);
            user = await User.create({
                name: req.body.username,
                password: pass,
                email: req.body.email
            });

            const token = createToken({id: user.id, username: user.name});

            res.json({message: "ok", userId: user.id, token});

        } catch (e) {
            console.error("E, register,", e);
            res.status(500).send({message: "some error"});
        }
    }
};