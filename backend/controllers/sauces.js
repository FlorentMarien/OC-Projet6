const Sauces = require('../models/Sauces');

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces => {
            res.status(200).json( sauces );
        })
        .catch(error => ({error}));
}

exports.getSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id})
    .then(sauces => {
        res.status(200).json( sauces );
    })
    .catch(error => ({error}));
}

exports.sendSauces = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    let sauces = new Sauces({
        ...sauceObject,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes:0,
        dislikes:0
    });
    sauces.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ message: 'Echec création', error }));
    
}