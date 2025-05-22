const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const authMiddleware = require('../middleware/auth');

const restrictTo = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

router.post('/register', superAdminController.registerSuperAdmin);
router.post('/login', superAdminController.loginSuperAdmin);
router.get('/', authMiddleware, restrictTo(['superadmin']), superAdminController.getAllSuperAdmins);
router.get('/:id', authMiddleware, superAdminController.getSuperAdminById);
router.put('/:id', authMiddleware, superAdminController.updateSuperAdmin);
router.delete('/:id', authMiddleware, restrictTo(['superadmin']), superAdminController.deleteSuperAdmin);
router.get('/:id/notifications', authMiddleware, superAdminController.getSuperAdminNotifications);

module.exports = router;