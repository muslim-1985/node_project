const passport = require('passport');

module.exports = {
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
