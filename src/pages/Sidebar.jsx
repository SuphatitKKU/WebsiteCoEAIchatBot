import React from 'react';
import { BookOpen, ChevronLeft, Menu, Settings, Bot, Newspaper, MessageSquare } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentMenu, setCurrentMenu, setSelectedCourse, setShowNewsForm }) => {
  return (
    <div className={`${sidebarOpen ? 'w-full md:w-64' : 'w-0'} bg-gradient-to-b from-[#dc2626] to-[#7d1315] transition-all duration-300 overflow-hidden flex flex-col fixed md:relative h-full z-20`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">CODME</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:bg-white/10 p-1 rounded"
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
          
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-white rounded-lg hover:bg-white/10 transition-colors">
            <Bot size={20} />
            <span>ตั้งค่า AI</span>
          </button>
        </nav>
      </div>

      {/* User Profile at Bottom */}
      <div className="mt-auto p-6 border-t border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <p className="text-white font-medium text-sm">Admin User</p>
            <p className="text-red-200 text-xs">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;