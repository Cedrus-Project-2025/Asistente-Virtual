const express = require('express');
const router = express.Router();
const { generateResponse } = require('../controllers/chatbotController');

router.post('/', generateResponse);

module.exports = router;
