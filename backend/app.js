const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const saucesRoute = require('./routes/sauces');
const path = require('path');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'Project6',
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoute);
app.use('/images/', express.static(path.join(__dirname, 'images')));

module.exports = app;
