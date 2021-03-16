const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const imagesController = require('../controllers/images.controller')

router.post('/', imagesController.save);
router.get('/:name', imagesController.get)

module.exports = router;