const mongoose = require('mongoose');
const Certificate = require('../models/Certificate');

exports.createCertificate = async (req, res) => {
  try {
    const { student, course, issueDate, pdfUrl } = req.body;

    if (!student || !course) {
      return res.status(400).json({ message: 'Student and course are required' });
    }

    if (!mongoose.isValidObjectId(student)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    if (!mongoose.isValidObjectId(course)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const certificate = new Certificate({
      student,
      course,
      issueDate: issueDate || Date.now(),
      pdfUrl: pdfUrl || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await certificate.save();
    res.status(201).json({
      message: 'Certificate created successfully',
      certificate: {
        id: certificate._id,
        student: certificate.student,
        course: certificate.course,
        issueDate: certificate.issueDate,
        pdfUrl: certificate.pdfUrl,
        createdAt: certificate.createdAt,
        updatedAt: certificate.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating certificate', error: error.message });
  }
};

exports.getAllCertificates = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Student') {
      query.student = req.user.id;
    } else if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const certificates = await Certificate.find(query)
      .populate('student', 'name email')
      .populate('course', 'title description');

    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certificates', error: error.message });
  }
};

exports.getCertificateById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid certificate ID' });
    }

    const certificate = await Certificate.findById(req.params.id)
      .populate('student', 'name email')
      .populate('course', 'title description');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    if (req.user.role === 'Student' && certificate.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor' && req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certificate', error: error.message });
  }
};

exports.updateCertificate = async (req, res) => {
  try {
    const { student, course, issueDate, pdfUrl } = req.body;

    if (student && !mongoose.isValidObjectId(student)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    if (course && !mongoose.isValidObjectId(course)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid certificate ID' });
    }

    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    const updateData = {
      student: student || undefined,
      course: course || undefined,
      issueDate: issueDate || undefined,
      pdfUrl: pdfUrl || undefined,
      updatedAt: new Date()
    };

    Object.assign(certificate, updateData);
    await certificate.save();

    res.status(200).json({
      message: 'Certificate updated successfully',
      certificate: {
        id: certificate._id,
        student: certificate.student,
        course: certificate.course,
        issueDate: certificate.issueDate,
        pdfUrl: certificate.pdfUrl,
        createdAt: certificate.createdAt,
        updatedAt: certificate.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating certificate', error: error.message });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid certificate ID' });
    }

    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting certificate', error: error.message });
  }
};

exports.filterCertificates = async (req, res) => {
  try {
    const { student, course } = req.query;
    const query = {};

    if (req.user.role === 'Student') {
      query.student = req.user.id;
    } else if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (student) {
      if (!mongoose.isValidObjectId(student)) {
        return res.status(400).json({ message: 'Invalid student ID' });
      }
      query.student = student;
    }

    if (course) {
      if (!mongoose.isValidObjectId(course)) {
        return res.status(400).json({ message: 'Invalid course ID' });
      }
      query.course = course;
    }

    const certificates = await Certificate.find(query)
      .populate('student', 'name email')
      .populate('course', 'title description');

    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering certificates', error: error.message });
  }
};