import express from 'express';
import Student from '../models/Student.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all students
router.get('/', auth, async (req, res) => {
  try {
    const { level, department } = req.query;
    const filter = {};
    
    if (level) filter.level = level;
    if (department) filter.department = department;

    const students = await Student.find(filter)
      .populate('userId', 'name email')
      .sort({ level: 1, createdAt: -1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Promote student
router.post('/:id/promote', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const levelMap = { '100': '200', '200': '300', '300': '400', '400': '500', '500': 'graduated' };
    const newLevel = levelMap[student.level];

    if (newLevel === 'graduated') {
      student.status = 'graduated';
    } else {
      student.level = newLevel;
      student.status = 'active';
    }

    await student.save();
    res.json({ message: `Student promoted to ${newLevel}L`, student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;