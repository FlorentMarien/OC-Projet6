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

exports.sendLikeSauces = ( req , res , next) => {

    let like=req.body.like;
    let userId=req.auth.userId;
    Sauces.findOne({ _id: req.params.id})
    .then(sauces => {
        let indexLiked = sauces.usersLiked.indexOf(userId);
        let indexDisliked = sauces.usersDisliked.indexOf(userId);
        if(like==0){
            if(indexLiked!==-1){
                sauces.usersLiked.splice(indexLiked,1);
            }
            else if(indexDisliked!==-1){
                sauces.usersDisliked.splice(indexDisliked,1);
            }
        }
        else if(like==-1){
            sauces.usersDisliked.push(userId);
        }
        else if(like==1){
            sauces.usersLiked.push(userId);
        }    
        sauces.likes=sauces.usersLiked.length;
        sauces.dislikes=sauces.usersDisliked.length;
        Sauces.updateOne({ _id: req.params.id}, { likes:sauces.likes,usersLiked:sauces.usersLiked,dislikes:sauces.dislikes,usersDisliked:sauces.usersDisliked})
            .then(() => res.status(200).json({message : 'Objet Liké!'}))
            .catch(error => res.status(401).json({ error }));      
        })       
        .catch(error => ({error}));
};
 