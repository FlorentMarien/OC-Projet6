const Sauces = require('../models/Sauces');

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces => {
            res.status(200).json( sauces );
        })
        .catch(error => ({error}));
}