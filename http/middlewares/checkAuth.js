const passport = require('passport');
const {Strategy, ExtractJwt} = require('passport-jwt');
const config = require('../../config/config');
const UserModel = require('../../models/UsersModel');
const mainRole = 'admin';
const noAccess = 'no_access';
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
            req.user = decryptToken;
            UserModel.findOne({
                username: req.user.username
            })
                .populate('role')
                .then((data) => {
                    const {name, permissions} = data.role;
                    if(name === mainRole) {
                        next()
                    }
                    for (const permission of permissions) {
                        if (permission.action === noAccess && req.path === permission.path && permission.method === req.method) {
                            return res.status(500).json({err: "Forbidden. Access denied"});
                        }
                    }
                    next()
            });
        })(req, res, next);
    }
};
