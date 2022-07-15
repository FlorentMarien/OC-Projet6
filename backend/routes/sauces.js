const express = require('express');
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');

const router = express.Router();
router.get('',auth,saucesCtrl.getAllSauces);
router.get('/:id',auth,saucesCtrl.getSauces);

module.exports = router;