const Artists = require ('../models/artists');
module.exports = class ArtistController extends Artists{
    async getAll (req, res) {
        try {
            let send = await super.all();
            res.send(send);
        } catch (e) {
            console.log(e);
        }
    }
};