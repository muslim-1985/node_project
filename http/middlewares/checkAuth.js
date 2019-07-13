const passport = require('passport');
const {Strategy, ExtractJwt} = require('passport-jwt');
const config = require('../../config/config');
const {User} = require('../../sequalize');
//получаем jwt токен из заголовков fromAuthHeaderAsBearerToken()
//и сравниваем с секретным ключем
let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.app.jwt.secretOrKey
};

module.exports = {
   //инициализируем авторизацию
    initPassportAuth () {
        passport.use(new Strategy(jwtOptions, async function(jwt_payload, done) {
            if(jwt_payload) {
                try {
                    let user = await User.findOne({where: {id: jwt_payload.id}});
                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                        // or you could create a new account
                    }
                } catch (e) {
                    return done(e, false);
                }

                // return done(false, jwt_payload);
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
            next()
        })(req, res, next);
    }
};
