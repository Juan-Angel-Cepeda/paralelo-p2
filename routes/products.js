const express = require('express');
const router = express.Router();
const controller = require('../controllers/products');

router.get('/',controller.list);
//router.post('/:id',controller.create);

module.exports = router;