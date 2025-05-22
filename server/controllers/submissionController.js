const mongoose = require('mongoose');
const Submission = require('../models/Submission');

exports.createSubmission = async (req, res) => {
  try {
    const { student, assessment, content } = req.body;

    if (!student || !assessment) {
      return res.status(400).json({ message: 'Student and assessment are required' });
    }

    if (!mongoose.isValidObjectId(student)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    if (!mongoose.isValidObjectId(assessment)) {
      return res.status(400).json({ message: 'Invalid assessment ID' });
    }

    if (req.user.role === 'Student' && student !== req.user.id) {
      return res.status(403).json({ message: 'Students can only submit for themselves' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor' && req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const submission = new Submission({
      student,
      assessment,
      content: content || '',
      status: 'submitted',
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await submission.save();
    res.status(201).json({
      message: 'Submission created successfully',
      submission: {
        id: submission._id,
        student,
        assessment,
        content: submission.content,
        score: submission.score,
        feedback: submission.feedback,
        status: submission.status,
        submittedAt: submission.submittedAt,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating submission', error: error.message });
  }
};

exports.getAllSubmissions = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Student') {
      query.student = req.user.id;
    } else if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const submissions = await Submission.find(query)
      .populate('student', 'name email')
      .populate('assessment', 'title description');

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
};

exports.getSubmissionById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid submission ID' });
    }

    const submission = await Submission.findById(req.params.id)
      .populate('student', 'name email')
      .populate('assessment', 'title description');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (req.user.role === 'Student' && submission.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor' && req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submission', error: error.message });
  }
};

exports.updateSubmission = async (req, res) => {
  try {
    const { student, assessment, content, score, feedback, status } = req.body;

    if (student && !mongoose.isValidObjectId(student)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    if (assessment && !mongoose.isValidObjectId(assessment)) {
      return res.status(400).json({ message: 'Invalid assessment ID' });
    }

    if (score !== undefined && (typeof score !== 'number' || score < 0)) {
      return res.status(400).json({ message: 'Score must be a non-negative number' });
    }

    if (status && !['submitted', 'graded', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid submission ID' });
    }

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (req.user.role === 'Student') {
      if (submission.student.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (submission.status !== 'pending') {
        return res.status(403).json({ message: 'Students can only update pending submissions' });
      }
      if (student || assessment || score || feedback || status) {
        return res.status(403).json({ message: 'Students can only update content' });
      }
    } else if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = {
      student: student || undefined,
      assessment: assessment || undefined,
      content: content || undefined,
      score: score !== undefined ? score : undefined,
      feedback: feedback || undefined,
      status: status || undefined,
      updatedAt: new Date()
    };

    Object.assign(submission, updateData);
    await submission.save();

    res.status(200).json({
      message: 'Submission updated successfully',
      submission: {
        id: submission._id,
        student: submission.student,
        assessment: submission.assessment,
        content: submission.content,
        score: submission.score,
        feedback: submission.feedback,
        status: submission.status,
        submittedAt: submission.submittedAt,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating submission', error: error.message });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid submission ID' });
    }

    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting submission', error: error.message });
  }
};

exports.filterSubmissions = async (req, res) => {
  try {
    const { student, assessment, status } = req.query;
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

    if (assessment) {
      if (!mongoose.isValidObjectId(assessment)) {
        return res.status(400).json({ message: 'Invalid assessment ID' });
      }
      query.assessment = assessment;
    }

    if (status) {
      if (!['submitted', 'graded', 'pending'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      query.status = status;
    }

    const submissions = await Submission.find(query)
      .populate('student', 'name email')
      .populate('assessment', 'title description');

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering submissions', error: error.message });
  }
};