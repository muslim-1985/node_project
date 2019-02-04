const UsersModel = require('../../models/UsersModel');
const CategoryModel = require('../../models/CategoryModel');
const GoodModel = require('../../models/GoodModel');
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
    async setCategory (req ,res) {
      try {
          let category = await CategoryModel.create({
              category: req.body.category,
          });
          res.json(category)
      }  catch (e) {
          console.log(e);
      }
    },
    async getCategory (req, res) {
      try {
          let result = await CategoryModel.find({});
          res.status(200).json(result);
      }  catch (e) {
          console.log(e);
      }
    },
    async setGood (req, res) {
        let goodSave = new GoodModel;
        goodSave.name = req.body.name;
        goodSave.price = req.body.price;
        goodSave.category = req.body.category;
        goodSave.image.path = 'images/' + req.file.filename;
        goodSave.image.contentType = req.file.mimetype;
        goodSave.image.originalName = req.file.originalname;
      try {
          await goodSave.save();
          console.log('save completed');

          res.status(200).json('good')
      }  catch (e) {
          console.log(e);
      }
    },
    async getGood (req, res) {
      try {
          let getGood = await GoodModel.find({}).populate('category');
          res.status(200).json(getGood);
      }  catch (e) {
          console.log(e);
      }
    },
    async deleteGood (req, res) {
        try{
            fs.unlinkSync('./public/' + req.body.path);
            let del = await GoodModel.findByIdAndRemove(req.body.id);
            //console.log(req.body.path);
            res.send(del);
        } catch (e) {
            console.log(e);
        }
    },
    async getUserAdminMessages (req, res) {
        try {
            let userMessages = await UsersModel.findOne({chatId: req.params.chatId});
            res.json(userMessages);
        } catch (e) {
            console.log(e)
        }
    },
    async login (req, res) {
        try {
            let user = await UsersModel.findOne({username: {$regex: _.escapeRegExp(req.body.username), $options: "i"}}).lean().exec();
            if(user != void(0) && bcrypt.compareSync(req.body.password, user.password)) {
                const token = createToken({id: user._id, username: user.username});
                res.json({message: "User login success", token});
            }
             else res.status(400).send({message: "User not exist or password not correct"});
        } catch (e) {
            console.error("E, login,", e);
            res.status(500).send({message: "some error"});
        }
    },

    async register(req, res) {
        try {
            let user = await UsersModel.findOne({username: {$regex: _.escapeRegExp(req.body.username), $options: "i"}}).lean().exec();
            if(user != void(0)) return res.status(400).send({message: "Пользователь уже зарегестрирован в системе"});
            //создаем юзера
            user = await UsersModel.create({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            });

            const token = createToken({id: user._id, username: user.username});

            res.json({message: "ok", token});

        } catch (e) {
            console.error("E, register,", e);
            res.status(500).send({message: "some error"});
        }
    }
};