const Sauces = require('../models/Sauces');
const fs = require('fs');

exports.getAllSauces = (req, res) => {
    Sauces.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => ({ error }));
};

exports.getSauces = (req, res) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => ({ error }));
};

exports.sendSauces = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    let sauces = new Sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`,
    });
    sauces
        .save()
        .then(() =>
            res.status(201).json({
                message: 'Objet enregistré !',
            })
        )
        .catch((error) =>
            res.status(400).json({
                message: 'Echec création',
                error,
            })
        );
};

exports.changeSauces = (req, res) => {
    const saucesObject = req.file
        ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };
    delete saucesObject._userId;
    Sauces.findOne({ _id: req.params.id })
        .then((sauces) => {
            if (req.file) {
                //Si changement d'image suppresion de l'ancienne
                const filename = sauces.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`);
            }
            Sauces.updateOne(
                {
                    _id: req.params.id,
                },
                {
                    ...saucesObject,
                    _id: req.params.id,
                }
            )
                .then(() =>
                    res.status(200).json({
                        message: 'Objet modifié!',
                    })
                )
                .catch((error) =>
                    res.status(401).json({
                        error,
                    })
                );
        })
        .catch((error) => {
            res.status(400).json({
                error,
            });
        });
};

exports.deleteSauces = (req, res) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauces) => {
            if (sauces.userId != req.auth.userId) {
                res.status(401).json({
                    message: 'Not authorized',
                });
            } else {
                const filename = sauces.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauces.deleteOne({
                        _id: req.params.id,
                    })
                        .then(() => {
                            res.status(200).json({
                                message: 'Objet supprimé !',
                            });
                        })
                        .catch((error) =>
                            res.status(401).json({
                                error,
                            })
                        );
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                error,
            });
        });
};

exports.sendLikeSauces = (req, res) => {
    let like = req.body.like;
    let userId = req.auth.userId;
    Sauces.findOne({ _id: req.params.id })
        .then((sauces) => {
            if (like == 0) {
                if (sauces.usersLiked.indexOf(userId) != -1) {
                    sauces.usersLiked.splice(
                        sauces.usersLiked.indexOf(userId),
                        1
                    );
                } else {
                    sauces.usersDisliked.splice(
                        sauces.usersDisliked.indexOf(userId),
                        1
                    );
                }
            } else if (like == -1) {
                sauces.usersDisliked.push(userId);
            } else if (like == 1) {
                sauces.usersLiked.push(userId);
            }
            Sauces.updateOne(
                {
                    _id: req.params.id,
                },
                {
                    likes: sauces.usersLiked.length,
                    usersLiked: sauces.usersLiked,
                    dislikes: sauces.usersDisliked.length,
                    usersDisliked: sauces.usersDisliked,
                }
            )
                .then(() =>
                    res.status(200).json({
                        message: 'Objet Liké!',
                    })
                )
                .catch((error) =>
                    res.status(401).json({
                        error,
                    })
                );
        })
        .catch((error) => ({ error }));
};
