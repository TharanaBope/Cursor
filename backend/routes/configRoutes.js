const express = require('express');
const router = express.Router();
const ConfigController = require('../controllers/configController');
const auth = require('../middleware/auth');

router.post('/', auth, ConfigController.createConfig);
router.get('/', auth, ConfigController.getUserConfigs);

module.exports = router; 