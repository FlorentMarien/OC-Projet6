const Sauces = require('../models/Sauces');
const fs = require('fs');

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

exports.changeSauces = (req, res, next) => {
    const saucesObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete saucesObject._userId;
    Sauces.findOne({_id: req.params.id})
        .then((sauces) => {        
            if(req.file){
                //Si changement d'image suppresion de l'ancienne
                const filename = sauces.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`,() => {});
            }
            Sauces.updateOne({ _id: req.params.id}, { ...saucesObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id})
        .then(sauces => {
            if (sauces.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauces.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauces.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};