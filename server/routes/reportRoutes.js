const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');

const restrictTo = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

router.post('/', authMiddleware, restrictTo(['SuperAdmin']), reportController.createReport);
router.get('/', authMiddleware, restrictTo(['SuperAdmin']), reportController.getAllReports);
router.get('/:id', authMiddleware, restrictTo(['SuperAdmin']), reportController.getReportById);
router.put('/:id', authMiddleware, restrictTo(['SuperAdmin']), reportController.updateReport);
router.delete('/:id', authMiddleware, restrictTo(['SuperAdmin']), reportController.deleteReport);
router.get('/filter', authMiddleware, restrictTo(['SuperAdmin']), reportController.filterReports);

module.exports = router;