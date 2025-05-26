const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['SuperAdmin']), reportController.createReport);
router.get('/', authMiddleware(['SuperAdmin']), reportController.getAllReports);
router.get('/:id', authMiddleware(['SuperAdmin']), reportController.getReportById);
router.put('/:id', authMiddleware(['SuperAdmin']), reportController.updateReport);
router.delete('/:id', authMiddleware(['SuperAdmin']), reportController.deleteReport);
router.get('/filter', authMiddleware(['SuperAdmin']), reportController.filterReports);

module.exports = router;