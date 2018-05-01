const passport = require('passport');

module.exports = {
    checkAuth (req, res, next) {
        passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtError) => {
            if(jwtError) {
                console.log(jwtError);
                return res.status(500).send('Ошибка аутентификации, передан неверный токен');
            }
            req.user = decryptToken;
            next()
        })(req, res, next);
    }
};
