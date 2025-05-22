const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    createAuditLog,
    getAllAuditLogs,
    getAuditLogById,
    filterAuditLogs
} = require('../controllers/auditLogController');


router.post('/', authMiddleware, createAuditLog);
router.get('/', authMiddleware, getAllAuditLogs);
router.get('/:id', authMiddleware, getAuditLogById);
router.get('/filter', authMiddleware, filterAuditLogs);

module.exports = router;