import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get courses
router.get('/', auth, async (req, res) => {
  try {
    const { level, department } = req.query;
    const filter = {};
    
    if (level) filter.level = level;
    if (department) filter.department = department;

    const courses = await Course.find(filter)
      .populate('lecturerId', 'name')
      .sort({ courseCode: 1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create course
router.post('/', auth, async (req, res) => {
  try {
    if (!['lecturer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;