const Lesson = require('../models/Lesson');
const Unit = require('../models/Unit');

exports.createLesson = async (req, res) => {
  try {
    const { title, unit, content, order } = req.body;

    if (!title || !unit || order == null) {
      return res.status(400).json({ success: false, message: 'Title, unit, and order are required' });
    }

    const unitExists = await Unit.findById(unit);
    if (!unitExists) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    const orderExists = await Lesson.findOne({ unit, order });
    if (orderExists) {
      return res.status(400).json({ success: false, message: 'Order already exists for this unit' });
    }

    const lesson = new Lesson({ title, unit, content, order });
    await lesson.save();

    await Unit.findByIdAndUpdate(unit, { $push: { lessons: lesson._id } });

    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating lesson', error: error.message });
  }
};

exports.getLessons = async (req, res) => {
  try {
    const filter = {};
    if (req.query.unit) {
      filter.unit = req.query.unit;
    }

    const lessons = await Lesson.find(filter)
      .populate('unit', 'title')
      .sort({ order: 1 });

    res.status(200).json({ success: true, data: lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching lessons', error: error.message });
  }
};

exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('unit', 'title');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching lesson', error: error.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { title, unit, content, order } = req.body;
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    if (unit && unit !== lesson.unit.toString()) {
      const newUnit = await Unit.findById(unit);
      if (!newUnit) {
        return res.status(404).json({ success: false, message: 'New unit not found' });
      }

      await Unit.findByIdAndUpdate(lesson.unit, { $pull: { lessons: lesson._id } });
      await Unit.findByIdAndUpdate(unit, { $push: { lessons: lesson._id } });

      lesson.unit = unit;
    }

    if ((order != null && order !== lesson.order) || (unit && unit !== lesson.unit.toString())) {
      const duplicateOrder = await Lesson.findOne({
        _id: { $ne: lesson._id },
        unit: lesson.unit,
        order: order != null ? order : lesson.order,
      });

      if (duplicateOrder) {
        return res.status(400).json({ success: false, message: 'Order already exists for this unit' });
      }

      if (order != null) lesson.order = order;
    }

    if (title) lesson.title = title;
    if (content !== undefined) lesson.content = content;
    lesson.updatedAt = Date.now();

    await lesson.save();

    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating lesson', error: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    await Unit.findByIdAndUpdate(lesson.unit, { $pull: { lessons: lesson._id } });
    await lesson.deleteOne();

    res.status(200).json({ success: true, message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting lesson', error: error.message });
  }
};
