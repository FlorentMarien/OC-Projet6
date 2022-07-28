const express = require('express');
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const router = express.Router();
router.get('',auth,saucesCtrl.getAllSauces);
router.get('/:id',auth,saucesCtrl.getSauces);
router.post('', auth,multer,saucesCtrl.sendSauces);
router.put('/:id', auth,multer,saucesCtrl.changeSauces);
router.delete('/:id', auth,multer,saucesCtrl.deleteSauces);
router.post('/:id/like', auth,saucesCtrl.sendLikeSauces);

module.exports = router;