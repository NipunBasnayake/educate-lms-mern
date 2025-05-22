const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createNotification,
  getUserNotifications,
  getAllNotifications,
  getNotificationById,
  markNotificationAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

router.post('/', auth(['Instructor', 'SuperAdmin']), createNotification);
router.get('/user', auth(['Student', 'Instructor', 'SuperAdmin']), getUserNotifications);
router.get('/all', auth(['SuperAdmin']), getAllNotifications);
router.get('/:id', auth(['Student', 'Instructor', 'SuperAdmin']), getNotificationById);
router.put('/:id/read', auth(['Student', 'Instructor', 'SuperAdmin']), markNotificationAsRead);
router.delete('/:id', auth(['Student', 'Instructor', 'SuperAdmin']), deleteNotification);

module.exports = router;
