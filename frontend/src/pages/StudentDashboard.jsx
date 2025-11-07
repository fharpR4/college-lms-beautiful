import { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, TrendingUp, Award } from 'lucide-react';
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

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const profileData = JSON.parse(localStorage.getItem('profile'));
    setProfile(profileData);
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const level = JSON.parse(localStorage.getItem('profile')).level;
      const res = await api.get(`/courses?level=${level}`);
      setCourses(res.data.slice(0, 6));
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="student" />
      
      <main className="flex-1 ml-72 p-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Welcome back!
          </h1>
          <p className="text-slate-600">Here's your academic overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={GraduationCap}
            label="Current Level"
            value={`${profile.level}L`}
            sublabel={profile.department}
            gradient="from-primary-500 to-blue-500"
          />
          
          <StatCard
            icon={Award}
            label="CGPA"
            value={profile.cgpa.toFixed(2)}
            sublabel="Excellent performance"
            gradient="from-green-500 to-emerald-500"
          />
          
          <StatCard
            icon={BookOpen}
            label="Courses"
            value={courses.length}
            sublabel="This semester"
            gradient="from-purple-500 to-pink-500"
          />
          
          <StatCard
            icon={TrendingUp}
            label="Attendance"
            value="92%"
            sublabel="Keep it up!"
            gradient="from-orange-500 to-red-500"
          />
        </div>

        <div className="glass-card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Available Courses</h2>
            <span className="text-sm text-slate-500">{profile.level} Level</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="group p-6 bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 hover:border-primary-400 rounded-2xl transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                    {course.units} Units
                  </span>
                </div>
                
                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 mb-2">{course.courseCode}</p>
                <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No courses available for your level</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}