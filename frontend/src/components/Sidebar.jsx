import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = {
    admin: [
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/admin/students', icon: Users, label: 'Students' },
      { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
    ],
    lecturer: [
      { path: '/lecturer', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/lecturer/courses', icon: BookOpen, label: 'My Courses' },
      { path: '/lecturer/students', icon: Users, label: 'Students' },
    ],
    student: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/courses', icon: BookOpen, label: 'My Courses' },
      { path: '/results', icon: GraduationCap, label: 'Results' },
    ]
  };

  const items = menuItems[role] || [];

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-white to-primary-50/30 border-r border-slate-200 flex flex-col fixed left-0 top-0 shadow-xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              RoeTechHub
            </h1>
            <p className="text-xs text-slate-500 font-medium">College Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}