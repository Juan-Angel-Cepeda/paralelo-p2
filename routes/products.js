const express = require('express');
const router = express.Router();
const controller = require('../controllers/products');

router.get('/',controller.list);
router.get('/:id',controller.get);
router.delete('/:id',controller.destroy);
router.post('/',controller.create);

module.exports = router;