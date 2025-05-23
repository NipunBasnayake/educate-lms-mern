const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const auth = require('../middleware/auth');

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
router.get('/', auth, restrictTo(['superadmin']), superAdminController.getAllSuperAdmins);
router.get('/:id', auth, restrictTo(['superadmin']), superAdminController.getSuperAdminById);
router.put('/:id', auth, restrictTo(['superadmin']), superAdminController.updateSuperAdmin);
router.delete('/:id', auth, restrictTo(['superadmin']), superAdminController.deleteSuperAdmin);
router.get('/:id/notifications', auth, restrictTo(['superadmin']), superAdminController.getSuperAdminNotifications);

module.exports = router;
