const express = require('express');
const route = express.Router();
const bodyParser = require('body-parser');
const Artist = require('../controllers/artists');
const LittleBot = require('../controllers/LittleBot');
route.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
route.use(bodyParser.json());

    route.get('/', async (req, res, next) => {
        try {
            res.send('hello api');
        } catch(e) {
            next(e);
        }
    });
    route.post('/artists', Artist.setAr);
    route.get('/artists', Artist.getAll);
    route.get('/artists/:id', Artist.showOne);
    route.put('/artists/:id/update', Artist.actionUpdate);
    route.delete('/artists/:id/delete', Artist.actionDelete);

    //route.get('/bot', LittleBot.BotMsg);

module.exports = route;