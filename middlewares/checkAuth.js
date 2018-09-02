const passport = require('passport');
const {Strategy, ExtractJwt} = require('passport-jwt');
const config = require('../config/config');
//получаем jwt токен из заголовков fromAuthHeaderAsBearerToken()
//и сравниваем с секретным ключем
let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.app.jwt.secretOrKey
};

module.exports = {
   //инициализируем авторизацию
    initPassportAuth () {
        passport.use(new Strategy(jwtOptions, function(jwt_payload, done) {
            if(jwt_payload) {
                return done(false, jwt_payload);
            }
            done();
        }));
    },
    checkAuth (req, res, next) {
        passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtError) => {
            if(jwtError) {
                //console.log(jwtError);
                return res.status(500).json({err:'Ошибка аутентификации, передан неверный токен', jwtError});
            }
            req.user = decryptToken;
            next()
        })(req, res, next);
    }
};
