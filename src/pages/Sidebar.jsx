import React from 'react';
import { BookOpen, ChevronLeft, Newspaper, MessageSquare, LogOut } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentMenu, setCurrentMenu, setSelectedCourse, setShowNewsForm, user, onLogout }) => {
  return (
    <div className={`${sidebarOpen ? 'w-full md:w-64' : 'w-0'} bg-gradient-to-b from-[#dc2626] to-[#7d1315] transition-all duration-300 overflow-hidden flex flex-col fixed md:relative h-full z-20`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">CODME</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:bg-white/10 p-1 rounded md:hidden"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        
        <nav className="space-y-2">
          <button 
            onClick={() => {
              setCurrentMenu('courses');
              setSelectedCourse(null);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-white rounded-lg transition-colors ${
              currentMenu === 'courses' ? 'bg-white/10' : 'hover:bg-white/10'
            }`}
          >
            <BookOpen size={20} />
            <span>จัดการหลักสูตร</span>
          </button>

          <button 
            onClick={() => {
              setCurrentMenu('news');
              setSelectedCourse(null);
              setShowNewsForm(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-white rounded-lg transition-colors ${
              currentMenu === 'news' ? 'bg-white/10' : 'hover:bg-white/10'
            }`}
          >
            <Newspaper size={20} />
            <span>จัดการข่าวสาร</span>
          </button>

          <button 
            onClick={() => {
              setCurrentMenu('feedback');
              setSelectedCourse(null);
              setShowNewsForm(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-white rounded-lg transition-colors ${
              currentMenu === 'feedback' ? 'bg-white/10' : 'hover:bg-white/10'
            }`}
          >
            <MessageSquare size={20} />
            <span>จัดการ Feedback</span>
          </button>
        </nav>
      </div>

      {/* User Profile at Bottom */}
      <div className="mt-auto p-6 border-t border-white/20">
        <div className="flex items-center space-x-3 mb-3">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
              {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">
              {user?.displayName || user?.email?.split('@')[0] || 'Admin User'}
            </p>
            <p className="text-red-200 text-xs truncate">{user?.email || 'admin@codme.com'}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
        >
          <LogOut size={16} />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;