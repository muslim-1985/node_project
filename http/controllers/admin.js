
const {User} = require('../../sequalize')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config/config');

function createToken (body) {
    return jwt.sign(
        body,
        config.app.jwt.secretOrKey,
        {expiresIn: '7h'}
    );
}

module.exports = {
    async resPage (req, res) {
        try {
            let users = await User.findAll({});
            res.status(200).json(users);
        } catch (e) {
            res.status(500).send('Ошибка сервера');
            console.log(e)
        }

    },
   
    // async getUserAdminMessages (req, res) {
    //     try {
    //         let userMessages = await UsersModel.findOne({chatId: req.params.chatId});
    //         res.json(userMessages);
    //     } catch (e) {
    //         console.log(e)
    //     }
    // },
    async login (req, res) {
        try {
            let user = await User.findOne({ where: {name:req.body.username}});
            if(user != void(0) && bcrypt.compareSync(req.body.password, user.password)) {
                const token = createToken({id: user.id, username: user.name});
                res.json({message: "User login success", userId: user.id, token});
            }
             else res.status(400).send({message: "User not exist or password not correct"});
        } catch (e) {
            console.error("E, login,", e);
            res.status(500).send({message: "some error"});
        }
    },

    async register(req, res) {
        try {
            let user = await User.findOne({where: {name: req.body.username}});
            if(user != void(0)) return res.status(400).send({message: "Пользователь уже зарегестрирован в системе"});
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