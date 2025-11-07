import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  units: {
    type: Number,
    required: true
  },
  level: {
    type: String,
    enum: ['100', '200', '300', '400', '500'],
    required: true
  },
  department: String,
  lecturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);