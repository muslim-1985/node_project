const app = require('express');
const exp = app();
const route = app.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
//const Artist = require('../controllers/artists');
const Admin = require('../http/controllers/admin');
const BotUsers = require('../http/controllers/botUsers');
const multer = require('multer');
const {checkAuth} = require('../http/middlewares/checkAuth');
const {validateRegister, validateLogin} = require('../http/middlewares/validate');
//промежуточная функция сохранения файла на сервере и в бд
const storage = multer.diskStorage({
    destination (req, file, cb) {
        cb(null, './public/images');
    },
    filename (req, file ,cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const upload = multer({storage});
//json parse body parser
exp.use(bodyParser.json());
//cors enabled by libs
exp.use(cors());

exp.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
route.use(bodyParser.json());
//enabled CORS
route.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
    next();
});

route.options('/', cors());
route.options('/botUsers', cors());
route.options('/botUsers:chatId', cors());

route.get('/', checkAuth, Admin.resPage);
//botUsers controller
route.get('/botUsers', checkAuth, BotUsers.getAllUsersAndMessages);
route.get('/userMessages/:chatId', checkAuth, BotUsers.getUserMessages);

route.post('/login', validateLogin(), Admin.login);

route.post('/register', validateRegister(), Admin.register);

// route.post('/logout', (req, res) => {
//     res.clearCookie('token');
//     res.status(200).send({message: "Logout success."});
// });
//
// route.post('/artists', checkAuth, Artist.setAr);
// route.get('/artists', Artist.getAll);
// route.get('/artists/:id', Artist.showOne);
// route.put('/artists/:id/update', Artist.actionUpdate);
// route.delete('/artists/:id/delete', Artist.actionDelete);

    //routes.post(`/${config.app.botToken}`, LittleBot.BotMsg);

module.exports = route;