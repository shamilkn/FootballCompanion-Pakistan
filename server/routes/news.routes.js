const express = require('express');
const newsController = require('../controllers/news.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.get('/', newsController.getAll);
router.post('/', newsController.create);
router.patch('/:id', newsController.update);
router.delete('/:id', newsController.delete);

module.exports = router;