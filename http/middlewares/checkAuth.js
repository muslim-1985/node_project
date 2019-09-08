const passport = require('passport');
const {Strategy, ExtractJwt} = require('passport-jwt');
const config = require('../../config/config');
const UserModel = require('../../models/UsersModel');
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
                console.log(jwtError);
                return res.status(500).json({err:'Ошибка аутентификации, передан неверный токен', jwtError});
            }
            console.log(req.path);
            req.user = decryptToken;
            UserModel.findOne({
                username: req.user.username
            })
                .populate('roles')
                .then((data) => {
                for (let res of data.roles) {
                    if (res.name === 'admin') {
                        next();
                    }
                    for (let permission of res.permissions) {
                        console.log(permission)
                    }
                }
            });
            next()
        })(req, res, next);
    }
};
