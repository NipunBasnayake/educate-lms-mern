const express = require('express');
const router = express.Router();
const { createLecturer } = require('../controllers/lecturerController');

router.post('/', createLecturer);

module.exports = router;