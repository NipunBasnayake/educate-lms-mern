const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/auth');

const restrictTo = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

router.post('/', authMiddleware, submissionController.createSubmission);
router.get('/', authMiddleware, submissionController.getAllSubmissions);
router.get('/:id', authMiddleware, submissionController.getSubmissionById);
router.put('/:id', authMiddleware, submissionController.updateSubmission);
router.delete('/:id', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), submissionController.deleteSubmission);
router.get('/filter', authMiddleware, submissionController.filterSubmissions);

module.exports = router;