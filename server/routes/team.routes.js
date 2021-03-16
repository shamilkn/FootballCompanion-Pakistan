const express = require('express');
const teamController = require('../controllers/team.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.get('/', teamController.getAll);
router.get('/:id', teamController.getOne);

router.use(authController.protect);

router.post('/', teamController.createTeam);
router.post('/join_request', teamController.requestAsMember);
router.post('/members/request/accept', teamController.acceptMemberRequest);
router.post('/members/request/reject', teamController.rejectMemberRequest);
router.post('/matches/request/accept', teamController.acceptMatchRequest);
router.post('/matches/request/reject', teamController.rejectMatchRequest);
router.post('/match_request/', teamController.matchRequest);

module.exports = router;