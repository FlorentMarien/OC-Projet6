const express = require('express');
const saucesCtrl = require('../controllers/sauces');

const router = express.Router();
router.get('',saucesCtrl.getAllSauces);

module.exports = router;