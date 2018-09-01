const app = require('express');
const exp = app();
const route = app.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
//const Artist = require('../controllers/artists');
const Admin = require('../controllers/admin');
const BotUsers = require('../controllers/botUsers');
const LittleBot = require('../controllers/LittleBot');
const multer = require('multer');
const {checkAuth} = require('../middlewares/checkAuth');
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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

route.options('/', cors());
route.options('/goods', cors());
route.options('/getGood', cors());
route.options('/deleteGood', cors());
route.options('/botUsers', cors());
route.options('/botUsers:chatId', cors());

route.get('/', checkAuth, Admin.resPage);
route.post('/info', Admin.setCategory);
route.post('/setGood', upload.single('image'), Admin.setGood);
route.get('/getGood', checkAuth, Admin.getGood);
route.post('/deleteGood', Admin.deleteGood);
route.get('/goods', checkAuth, Admin.getCategory);
//botUsers controller
route.post('/botUsers', BotUsers.getAllUsers);
route.get('/userMessages/:chatId', BotUsers.getUserMessages);
route.post('/deleteMessage', LittleBot.deleteMessage);

route.post('/login', Admin.login);

route.post('/register', Admin.register);

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