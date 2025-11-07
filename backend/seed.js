import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Student from './models/Student.js';
import Course from './models/Course.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@college.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    });

    // Create Lecturer
    const lecturer = await User.create({
      name: 'Dr. John Smith',
      email: 'lecturer@college.com',
      password: await bcrypt.hash('lecturer123', 10),
      role: 'lecturer'
    });

    // Create Student User
    const studentUser = await User.create({
      name: 'Test Student',
      email: 'student@college.com',
      password: 'not_used',
      role: 'student'
    });

    // Create Student Profile
    const student = await Student.create({
      userId: studentUser._id,
      studentCode: 'STU24-ABCD-1234-WXYZ',
      department: 'Computer Science',
      level: '100',
      cgpa: 3.85
    });

    // Create Courses
    const courses = await Course.insertMany([
      {
        courseCode: 'CSC101',
        title: 'Introduction to Computer Science',
        description: 'Fundamentals of programming and computer systems',
        units: 3,
        level: '100',
        department: 'Computer Science',
        lecturerId: lecturer._id
      },
      {
        courseCode: 'CSC201',
        title: 'Data Structures & Algorithms',
        description: 'Advanced data structures and algorithm design',
        units: 4,
        level: '200',
        department: 'Computer Science',
        lecturerId: lecturer._id
      },
      {
        courseCode: 'MTH101',
        title: 'Mathematics I',
        description: 'Calculus and linear algebra fundamentals',
        units: 3,
        level: '100',
        department: 'Computer Science',
        lecturerId: lecturer._id
      },
      {
        courseCode: 'PHY101',
        title: 'Physics I',
        description: 'Mechanics and properties of matter',
        units: 3,
        level: '100',
        department: 'Computer Science',
        lecturerId: lecturer._id
      },
      {
        courseCode: 'GST101',
        title: 'Use of English',
        description: 'Communication skills and essay writing',
        units: 2,
        level: '100',
        department: 'General Studies',
        lecturerId: lecturer._id
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Test Accounts:');
    console.log('Admin: admin@college.com / admin123');
    console.log('Lecturer: lecturer@college.com / lecturer123');
    console.log('Student Code: STU24-ABCD-1234-WXYZ');
    console.log(`\n✅ Created ${courses.length} courses`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();