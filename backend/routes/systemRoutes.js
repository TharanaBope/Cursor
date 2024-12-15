const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const auth = require('../middleware/auth');

router.post('/start', auth, systemController.startSystem.bind(systemController));
router.post('/stop', auth, systemController.stopSystem.bind(systemController));
router.get('/state', auth, systemController.getSystemState.bind(systemController));

module.exports = router; 