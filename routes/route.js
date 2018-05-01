const app = require('express');
const route = app.Router();
//const config = require('../config/config');
const bodyParser = require('body-parser');
const Artist = require('../controllers/artists');
const Admin = require('../controllers/admin');
const {checkAuth} = require('../middlewares/checkAuth');

//const LittleBot = require('../controllers/LittleBot');
route.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
route.use(bodyParser.json());

route.get('/', checkAuth, Admin.resPage);
route.post('/login', Admin.login);

route.post('/register', Admin.register);

route.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).send({message: "Logout success."});
});

route.post('/artists', checkAuth, Artist.setAr);
route.get('/artists', Artist.getAll);
route.get('/artists/:id', Artist.showOne);
route.put('/artists/:id/update', Artist.actionUpdate);
route.delete('/artists/:id/delete', Artist.actionDelete);

    //routes.post(`/${config.app.botToken}`, LittleBot.BotMsg);

module.exports = route;