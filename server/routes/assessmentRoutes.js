const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createAssessment,
    getAssessments,
    getAssessmentById,
    updateAssessment,
    deleteAssessment,
} = require('../controllers/assessmentController');

router.post('/', auth(['Instructor', 'SuperAdmin']), createAssessment);
router.get('/', auth(['Student', 'Instructor', 'SuperAdmin']), getAssessments);
router.get('/:id', auth(['Student', 'Instructor', 'SuperAdmin']), getAssessmentById);
router.put('/:id', auth(['Instructor', 'SuperAdmin']), updateAssessment);
router.delete('/:id', auth(['Instructor', 'SuperAdmin']), deleteAssessment);

module.exports = router;