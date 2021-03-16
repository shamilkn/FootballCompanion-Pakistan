const express = require('express');
const tournamentController = require('../controllers/tournament.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.get('/', tournamentController.getAll);
router.post('/', tournamentController.create);
router.patch('/:id', tournamentController.update);
router.delete('/:id', tournamentController.delete);

module.exports = router;