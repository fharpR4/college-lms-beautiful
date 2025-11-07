import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Student login with code
router.post('/login-student', async (req, res) => {
  try {
    const { studentCode } = req.body;

    const student = await Student.findOne({ studentCode }).populate('userId');
    if (!student) {
      return res.status(401).json({ error: 'Invalid Student ID' });
    }

    const token = jwt.sign(
      { id: student.userId._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: student.userId._id,
        name: student.userId.name,
        email: student.userId.email,
        role: 'student'
      },
      profile: {
        studentCode: student.studentCode,
        level: student.level,
        department: student.department,
        cgpa: student.cgpa
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Staff login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !['lecturer', 'admin'].includes(user.role)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register student (admin only)
router.post('/register-student', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, email, department, level } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password: 'not_used',
      role: 'student'
    });

    const student = await Student.create({
      userId: user._id,
      department,
      level: level || '100'
    });

    res.status(201).json({
      message: 'Student registered successfully',
      student: {
        name: user.name,
        email: user.email,
        studentCode: student.studentCode,
        level: student.level
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    let profile = null;

    if (req.user.role === 'student') {
      profile = await Student.findOne({ userId: req.user._id });
    }

    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      },
      profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;