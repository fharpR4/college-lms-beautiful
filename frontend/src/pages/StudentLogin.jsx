import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sparkles, ArrowRight, Lock } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export default function StudentLogin() {
  const [studentCode, setStudentCode] = useState('');
  const [loginType, setLoginType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login-student', { studentCode });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('profile', JSON.stringify(res.data.profile));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'lecturer') navigate('/lecturer');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCode = (value) => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    // Format as: STU24-ABCD-1234-WXYZ (5-4-4-4 pattern)
    let formatted = '';
    if (cleaned.length > 0) formatted += cleaned.substr(0, 5);  // STU24
    if (cleaned.length > 5) formatted += '-' + cleaned.substr(5, 4);  // ABCD
    if (cleaned.length > 9) formatted += '-' + cleaned.substr(9, 4);  // 1234
    if (cleaned.length > 13) formatted += '-' + cleaned.substr(13, 4); // WXYZ
    
    return formatted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-float"></div>
        <div className="absolute w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -bottom-48 -right-48 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-2xl mb-4 animate-float">
            <GraduationCap className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-primary-100 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Powered by RoeTechHub
          </p>
        </div>

        {/* Login Toggle */}
        <div className="glass-card p-2 mb-6 flex gap-2">
          <button
            onClick={() => setLoginType('student')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              loginType === 'student'
                ? 'bg-white text-primary-600 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Student Login
          </button>
          <button
            onClick={() => setLoginType('staff')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              loginType === 'staff'
                ? 'bg-white text-primary-600 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Staff Login
          </button>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-medium animate-shake">
              {error}
            </div>
          )}

          {loginType === 'student' ? (
            <form onSubmit={handleStudentLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Student Code
                </label>
                <input
                  type="text"
                  placeholder="STU24-XXXX-XXXX-XXXX"
                  className="input-modern"
                  value={studentCode}
                  onChange={(e) => setStudentCode(formatCode(e.target.value))}
                  maxLength="20"
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  Enter your 17-character student code
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gradient w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Logging in...'
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Login as Student
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleStaffLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your.email@college.com"
                  className="input-modern"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input-modern"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gradient w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Logging in...'
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Login as Staff
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Test Credentials */}
          <div className="mt-8 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
            <p className="text-xs font-bold text-slate-600 mb-2">🧪 Test Credentials:</p>
            <div className="space-y-1 text-xs text-slate-600">
              {loginType === 'student' ? (
                <p>Student: <code className="px-2 py-1 bg-white rounded font-mono">STU24-ABCD-1234-WXYZ</code></p>
              ) : (
                <>
                  <p>Admin: admin@college.com / admin123</p>
                  <p>Lecturer: lecturer@college.com / lecturer123</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}