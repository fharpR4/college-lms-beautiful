import mongoose from 'mongoose';
import crypto from 'crypto';

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentCode: {
    type: String,
    unique: true,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['100', '200', '300', '400', '500'],
    default: '100'
  },
  cgpa: {
    type: Number,
    default: 0.0
  },
  status: {
    type: String,
    enum: ['active', 'carry_over', 'graduated'],
    default: 'active'
  },
  admissionYear: {
    type: Number,
    default: () => new Date().getFullYear()
  }
}, { timestamps: true });

// Auto-generate student code before saving
studentSchema.pre('save', function(next) {
  if (!this.studentCode) {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = crypto.randomBytes(6).toString('hex').toUpperCase();
    this.studentCode = `STU${year}-${random.slice(0,4)}-${random.slice(4,8)}-${random.slice(8,12)}`;
  }
  next();
});

export default mongoose.model('Student', studentSchema);