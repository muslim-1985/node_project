const app = require('express');
const exp = app();
const route = app.Router();
//const config = require('../config/config');
const bodyParser = require('body-parser');
const cors = require('cors');
const Artist = require('../controllers/artists');
const Admin = require('../controllers/admin');
const {checkAuth} = require('../middlewares/checkAuth');
//json parse body parser
exp.use(bodyParser.json());
//cors enabled by libs
exp.use(cors());
//const LittleBot = require('../controllers/LittleBot');
route.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
route.use(bodyParser.json());
//enabled CORS
route.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

route.options('/', cors());
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