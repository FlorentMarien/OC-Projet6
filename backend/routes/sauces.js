const express = require('express');
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');

const router = express.Router();
router.get('',auth,saucesCtrl.getAllSauces);

module.exports = router;