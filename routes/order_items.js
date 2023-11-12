const express = require('express');
const router = express.Router();
const controller = require('../controllers/order_items');

router.get('/',controller.list);
router.get('/:id',controller.get);

module.exports = router;