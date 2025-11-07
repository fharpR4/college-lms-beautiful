import { useState, useEffect } from 'react';
import { BookOpen, Users, FileText } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function LecturerDashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data.slice(0, 6));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="lecturer" />
      
      <main className="flex-1 ml-72 p-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Lecturer Dashboard
          </h1>
          <p className="text-slate-600">Manage your courses and students with ease</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            label="My Courses"
            value={courses.length}
            sublabel="Active this semester"
            gradient="from-primary-500 to-blue-500"
          />
          
          <StatCard
            icon={Users}
            label="Total Students"
            value="48"
            sublabel="Across all courses"
            gradient="from-green-500 to-emerald-500"
          />
          
          <StatCard
            icon={FileText}
            label="Assignments"
            value="12"
            sublabel="Pending grading"
            gradient="from-purple-500 to-pink-500"
          />
          
          <StatCard
            icon={BookOpen}
            label="Attendance"
            value="94%"
            sublabel="Average rate"
            gradient="from-orange-500 to-red-500"
          />
        </div>

        {/* Courses Section */}
        <div className="glass-card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">My Courses</h2>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">
              Create Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="group p-6 bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 hover:border-primary-400 rounded-2xl transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    {course.level}L
                  </span>
                </div>
                
                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 mb-3">{course.courseCode}</p>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-xs text-slate-500">{course.units} Units</span>
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                    View details →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No courses assigned yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}