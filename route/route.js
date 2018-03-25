const app = require('express');
const route = app.Router();
//const config = require('../config/config');
const bodyParser = require('body-parser');
const Artist = require('../controllers/artists');
const Admin = require('../controllers/admin');
const passport = require('passport');

//const LittleBot = require('../controllers/LittleBot');
route.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
route.use(bodyParser.json());
    //create tocken and check auth function

function checkAuth (req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtError) => {
        if(jwtError != void(0) || err != void(0)) {
            console.log(jwtError);
            return res.render('admin.html', { error: err || jwtError});
        }
        req.user = decryptToken;
        next()
    })(req, res, next);
}

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

    //route.post(`/${config.app.botToken}`, LittleBot.BotMsg);

module.exports = route;