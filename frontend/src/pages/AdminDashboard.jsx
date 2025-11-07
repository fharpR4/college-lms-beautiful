import { useState, useEffect } from 'react';
import { Users, BookOpen, TrendingUp, UserPlus } from 'lucide-react';
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

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, courses: 0 });
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Computer Science',
    level: '100'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        api.get('/students'),
        api.get('/courses')
      ]);
      
      setStats({
        students: studentsRes.data.length,
        courses: coursesRes.data.length
      });
      setStudents(studentsRes.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register-student', formData);
      setMessage('Student registered successfully!');
      setFormData({ name: '', email: '', department: 'Computer Science', level: '100' });
      fetchData();
      setTimeout(() => {
        setShowForm(false);
        setMessage('');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="admin" />
      
      <main className="flex-1 ml-72 p-8">
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600">Manage your institution efficiently</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-gradient flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Register Student
          </button>
        </div>

        {showForm && (
          <div className="glass-card p-6 mb-8 animate-slide-up">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Register New Student</h3>
            
            {message && (
              <div className={`mb-4 px-4 py-3 rounded-xl ${
                message.includes('success') 
                  ? 'bg-green-50 border-2 border-green-200 text-green-700' 
                  : 'bg-red-50 border-2 border-red-200 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="input-modern"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="input-modern"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <select
                className="input-modern"
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
              >
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
              </select>
              <input
                type="text"
                placeholder="Department"
                className="input-modern"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                required
              />
              <button type="submit" className="btn-gradient col-span-full">
                Register Student
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Students"
            value={stats.students}
            sublabel="Active students"
            gradient="from-blue-500 to-cyan-500"
          />
          
          <StatCard
            icon={BookOpen}
            label="Total Courses"
            value={stats.courses}
            sublabel="Available courses"
            gradient="from-green-500 to-emerald-500"
          />
          
          <StatCard
            icon={TrendingUp}
            label="Enrollments"
            value="24"
            sublabel="This semester"
            gradient="from-purple-500 to-pink-500"
          />
          
          <StatCard
            icon={Users}
            label="Lecturers"
            value="1"
            sublabel="Teaching staff"
            gradient="from-orange-500 to-red-500"
          />
        </div>

        <div className="glass-card p-6 animate-slide-up">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Students</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Student</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Student ID</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Level</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Department</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-slate-900">{student.userId?.name}</p>
                        <p className="text-sm text-slate-500">{student.userId?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <code className="px-2 py-1 bg-slate-100 rounded text-sm font-mono text-slate-700">
                        {student.studentCode}
                      </code>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {student.level}L
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">
                      {student.department}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}