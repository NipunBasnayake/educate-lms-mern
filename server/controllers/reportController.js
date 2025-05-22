const mongoose = require('mongoose');
const Report = require('../models/Report');

exports.createReport = async (req, res) => {
  try {
    const { type, data, format } = req.body;

    if (!type) {
      return res.status(400).json({ message: 'Type is required' });
    }

    if (!['course_performance', 'student_engagement', 'gradebook'].includes(type)) {
      return res.status(400).json({ message: 'Invalid report type' });
    }

    if (format && !['pdf', 'csv'].includes(format)) {
      return res.status(400).json({ message: 'Invalid format' });
    }

    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const report = new Report({
      type,
      generatedBy: req.user.id,
      data: data || {},
      format: format || 'pdf',
      createdAt: new Date()
    });

    await report.save();
    res.status(201).json({
      message: 'Report created successfully',
      report: {
        id: report._id,
        type,
        generatedBy: report.generatedBy,
        data: report.data,
        format: report.format,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating report', error: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reports = await Report.find()
      .populate('generatedBy', 'name email');

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const report = await Report.findById(req.params.id)
      .populate('generatedBy', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error: error.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const { type, data, format } = req.body;

    if (type && !['course_performance', 'student_engagement', 'gradebook'].includes(type)) {
      return res.status(400).json({ message: 'Invalid report type' });
    }

    if (format && !['pdf', 'csv'].includes(format)) {
      return res.status(400).json({ message: 'Invalid format' });
    }

    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const updateData = {
      type: type || undefined,
      data: data || undefined,
      format: format || undefined
    };

    Object.assign(report, updateData);
    await report.save();

    res.status(200).json({
      message: 'Report updated successfully',
      report: {
        id: report._id,
        type: report.type,
        generatedBy: report.generatedBy,
        data: report.data,
        format: report.format,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating report', error: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting report', error: error.message });
  }
};

exports.filterReports = async (req, res) => {
  try {
    const { type, generatedBy } = req.query;
    const query = {};

    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (type) {
      if (!['course_performance', 'student_engagement', 'gradebook'].includes(type)) {
        return res.status(400).json({ message: 'Invalid report type' });
      }
      query.type = type;
    }

    if (generatedBy) {
      if (!mongoose.isValidObjectId(generatedBy)) {
        return res.status(400).json({ message: 'Invalid generatedBy ID' });
      }
      query.generatedBy = generatedBy;
    }

    const reports = await Report.find(query)
      .populate('generatedBy', 'name email');

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering reports', error: error.message });
  }
};