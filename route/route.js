const app = require('express');
const route = app.Router();
//const config = require('../config/config');
const bodyParser = require('body-parser');
const Artist = require('../controllers/artists');
//const LittleBot = require('../controllers/LittleBot');
route.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
route.use(bodyParser.json());

    route.get('/', async (req, res, next) => {
        try {
            res.render('index.html');
        } catch(e) {
            next(e);
        }
    });
    route.post('/artists', Artist.setAr);
    route.get('/artists', Artist.getAll);
    route.get('/artists/:id', Artist.showOne);
    route.put('/artists/:id/update', Artist.actionUpdate);
    route.delete('/artists/:id/delete', Artist.actionDelete);

    //route.post(`/${config.app.botToken}`, LittleBot.BotMsg);

module.exports = route;