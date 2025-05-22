const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createCalendarEvent,
    getAllCalendarEvents,
    getCalendarEventById,
    updateCalendarEvent,
    deleteCalendarEvent,
    filterCalendarEvents
} = require('../controllers/calendarController');

const restrictTo = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

router.post('/', auth, restrictTo(['SuperAdmin', 'Instructor']), createCalendarEvent);
router.get('/', auth, getAllCalendarEvents);
router.get('/:id', auth, getCalendarEventById);
router.put('/:id', auth, restrictTo(['SuperAdmin', 'Instructor']), updateCalendarEvent);
router.delete('/:id', auth, restrictTo(['SuperAdmin', 'Instructor']), deleteCalendarEvent);
router.get('/filter', auth, filterCalendarEvents);

module.exports = router;