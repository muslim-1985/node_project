const Artists = require ('../models/artists');
let newArtists = new Artists();

module.exports = {
    async setAr(req, res) {
        newArtists.name = req.body.name;
        try {
            const sent = await newArtists.save();
            res.send(sent);
        } catch(e) {
            console.log(e);
        }
    },
    async getAll (req, res) {
        try {
            let result = await Artists.find({});
            res.render('artists.html', {artists: result});
        } catch (e) {
            console.log(e);
        }
    },
    async showOne (req, res) {
        try {
            let show = await Artists.findById(req.params.id);
            res.send(show);
        } catch (e) {
            console.log(e);
        }
    },
    async actionUpdate (req, res) {
        try {
            let update = await Artists.findByIdAndUpdate(req.params.id,{name: req.body.name});
            console.log(update);
            res.send(update);
        } catch (e) {
            console.log(e);
        }
    },
    async actionDelete (req, res) {
        try{
            let del = await Artists.findByIdAndRemove(req.params.id);
            console.log(del);
            res.send(del);
        } catch (e) {
            console.log(e);
        }
    }
};

// module.exports = class ArtistController extends Artists{
//     async actionDelete (req, res) {
//         try {
//             const del = await super.delete(req.params.id);
//             res.send(del);
//         } catch(e) {
//             console.log(e);
//         }
//     }
// };