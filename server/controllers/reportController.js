const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');
const Report = require('../models/Report');

const sendError = (res, status, message, error = null) => {
  res.status(status).json({ success: false, message, error: error?.message });
};

exports.createReport = async (req, res) => {
  try {
    const { type, data, format } = req.body;

    if (!type) {
      return sendError(res, 400, 'Type is required');
    }

    const validTypes = ['course_performance', 'student_engagement', 'gradebook'];
    if (!validTypes.includes(type)) {
      return sendError(res, 400, 'Invalid report type. Must be one of: ' + validTypes.join(', '));
    }

    if (format && !['pdf', 'csv'].includes(format)) {
      return sendError(res, 400, 'Invalid format. Must be one of: pdf, csv');
    }

    if (data && (typeof data !== 'object' || Array.isArray(data))) {
      return sendError(res, 400, 'Data must be a valid object');
    }

    const sanitizedType = sanitize(type);
    const sanitizedData = data ? sanitize(data) : {};
    const sanitizedFormat = format ? sanitize(format) : 'pdf';

    const report = new Report({
      type: sanitizedType,
      generatedBy: req.user.id,
      data: sanitizedData,
      format: sanitizedFormat,
      createdAt: new Date()
    });

    await report.save();
    const populatedReport = await Report.findById(report._id)
      .populate('generatedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: {
        id: populatedReport._id,
        type: populatedReport.type,
        generatedBy: populatedReport.generatedBy,
        data: populatedReport.data,
        format: populatedReport.format,
        createdAt: populatedReport.createdAt
      }
    });
  } catch (error) {
    sendError(res, 500, 'Error creating report', error);
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('generatedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    sendError(res, 500, 'Error fetching reports', error);
  }
};

exports.getReportById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid report ID');
    }

    const report = await Report.findById(req.params.id)
      .populate('generatedBy', 'name email');

    if (!report) {
      return sendError(res, 404, 'Report not found');
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    sendError(res, 500, 'Error fetching report', error);
  }
};

exports.updateReport = async (req, res) => {
  try {
    const { type, data, format } = req.body;

    if (type && !['course_performance', 'student_engagement', 'gradebook'].includes(type)) {
      return sendError(res, 400, 'Invalid report type. Must be one of: course_performance, student_engagement, gradebook');
    }

    if (format && !['pdf', 'csv'].includes(format)) {
      return sendError(res, 400, 'Invalid format. Must be one of: pdf, csv');
    }

    if (data && (typeof data !== 'object' || Array.isArray(data))) {
      return sendError(res, 400, 'Data must be a valid object');
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid report ID');
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return sendError(res, 404, 'Report not found');
    }

    const updateData = {
      type: type ? sanitize(type) : undefined,
      data: data ? sanitize(data) : undefined,
      format: format ? sanitize(format) : undefined,
      updatedAt: new Date()
    };

    Object.assign(report, updateData);
    await report.save();

    const updatedReport = await Report.findById(report._id)
      .populate('generatedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      data: {
        id: updatedReport._id,
        type: updatedReport.type,
        generatedBy: updatedReport.generatedBy,
        data: updatedReport.data,
        format: updatedReport.format,
        createdAt: updatedReport.createdAt,
        updatedAt: updatedReport.updatedAt
      }
    });
  } catch (error) {
    sendError(res, 500, 'Error updating report', error);
  }
};

exports.deleteReport = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid report ID');
    }

    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return sendError(res, 404, 'Report not found');
    }

    res.status(200).json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    sendError(res, 500, 'Error deleting report', error);
  }
};

exports.filterReports = async (req, res) => {
  try {
    const { type, generatedBy } = req.query;
    const query = {};

    if (type) {
      if (!['course_performance', 'student_engagement', 'gradebook'].includes(type)) {
        return sendError(res, 400, 'Invalid report type. Must be one of: course_performance, student_engagement, gradebook');
      }
      query.type = sanitize(type);
    }

    if (generatedBy) {
      if (!mongoose.isValidObjectId(generatedBy)) {
        return sendError(res, 400, 'Invalid generatedBy ID');
      }
      query.generatedBy = sanitize(generatedBy);
    }

    const reports = await Report.find(query)
      .populate('generatedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    sendError(res, 500, 'Error filtering reports', error);
  }
};