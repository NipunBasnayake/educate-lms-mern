const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const authMiddleware = require('../middleware/auth');

// Note: Consider adding rate-limiting middleware (e.g., express-rate-limit)
router.post('/', authMiddleware(['SuperAdmin', 'Instructor']), certificateController.createCertificate);
router.get('/', authMiddleware(['SuperAdmin', 'Instructor', 'Student']), certificateController.getAllCertificates);
router.get('/:id', authMiddleware(['SuperAdmin', 'Instructor', 'Student']), certificateController.getCertificateById);
router.put('/:id', authMiddleware(['SuperAdmin', 'Instructor']), certificateController.updateCertificate);
router.delete('/:id', authMiddleware(['SuperAdmin', 'Instructor']), certificateController.deleteCertificate);
router.get('/filter', authMiddleware(['SuperAdmin', 'Instructor', 'Student']), certificateController.filterCertificates);

module.exports = router;