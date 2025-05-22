const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createCertificate,
    getAllCertificates,
    getCertificateById,
    updateCertificate,
    deleteCertificate,
    filterCertificates
} = require('../controllers/certificateController');

const restrictTo = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

router.post('/', auth, restrictTo(['SuperAdmin', 'Instructor']), createCertificate);
router.get('/', auth, getAllCertificates);
router.get('/:id', auth, getCertificateById);
router.put('/:id', auth, restrictTo(['SuperAdmin', 'Instructor']), updateCertificate);
router.delete('/:id', auth, restrictTo(['SuperAdmin', 'Instructor']), deleteCertificate);
router.get('/filter', auth, filterCertificates);

module.exports = router;