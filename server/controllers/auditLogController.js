const mongoose = require('mongoose');
const AuditLog = require('../models/AuditLog');

exports.createAuditLog = async (req, res) => {
  try {
    const { action, details } = req.body;

    if (!action) {
      return res.status(400).json({ message: 'Action is required' });
    }

    if (!req.user || !req.user.id || !req.user.role) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!['Student', 'Instructor', 'SuperAdmin'].includes(req.user.role)) {
      return res.status(400).json({ message: 'Invalid userType' });
    }

    const auditLog = new AuditLog({
      action,
      user: req.user.id,
      userType: req.user.role,
      details: details || ''
    });

    await auditLog.save();
    res.status(201).json({
      message: 'Audit log created successfully',
      auditLog: {
        id: auditLog._id,
        action: auditLog.action,
        user: auditLog.user,
        userType: auditLog.userType,
        details: auditLog.details,
        createdAt: auditLog.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating audit log', error: error.message });
  }
};

exports.getAllAuditLogs = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const auditLogs = await AuditLog.find()
      .populate({
        path: 'user',
        select: 'name email',
        model: function(doc) {
          return doc.userType === 'Student' ? 'Student' :
                 doc.userType === 'Instructor' ? 'Instructor' : 'SuperAdmin';
        }
      });

    res.status(200).json(auditLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs', error: error.message });
  }
};

exports.getAuditLogById = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid audit log ID' });
    }

    const auditLog = await AuditLog.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email',
        model: function(doc) {
          return doc.userType === 'Student' ? 'Student' :
                 doc.userType === 'Instructor' ? 'Instructor' : 'SuperAdmin';
        }
      });

    if (!auditLog) {
      return res.status(404).json({ message: 'Audit log not found' });
    }

    res.status(200).json(auditLog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit log', error: error.message });
  }
};

exports.filterAuditLogs = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { user, userType, action } = req.query;
    const query = {};

    if (user) {
      if (!mongoose.isValidObjectId(user)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      query.user = user;
    }

    if (userType && ['Student', 'Instructor', 'SuperAdmin'].includes(userType)) {
      query.userType = userType;
    } else if (userType) {
      return res.status(400).json({ message: 'Invalid userType' });
    }

    if (action) {
      query.action = action;
    }

    const auditLogs = await AuditLog.find(query)
      .populate({
        path: 'user',
        select: 'name email',
        model: function(doc) {
          return doc.userType === 'Student' ? 'Student' :
                 doc.userType === 'Instructor' ? 'Instructor' : 'SuperAdmin';
        }
      });

    res.status(200).json(auditLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering audit logs', error: error.message });
  }
};