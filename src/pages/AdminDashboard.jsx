import React, { useState, useEffect } from 'react';
import { BookOpen, Newspaper, Menu, MessageSquare, ChevronLeft, Bot, LogOut, AlertTriangle } from 'lucide-react';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from 'firebase/auth';
import Sidebar from './Sidebar';
import CourseManagement from './CourseManagement';
import NewsManagement from './NewsManagement';
import FeedbackManagement from './FeedbackManagement';

// ============= CUSTOM LOGOUT MODAL =============
const LogoutModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-[fadeIn_0.2s_ease-out]">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="text-[#dc2626]" size={32} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
            ออกจากระบบ
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?
            {userName && (
              <span className="block mt-2 font-medium text-gray-800">
                ({userName})
              </span>
            )}
          </p>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white rounded-lg font-semibold hover:from-[#b91c1c] hover:to-[#991b1b] transition-all shadow-lg"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= LOGIN PAGE =============
const LoginPage = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(true); // เริ่มต้นด้วย true
  const [checkingRedirect, setCheckingRedirect] = useState(true);

  // ตรวจสอบว่าเป็น Mobile หรือไม่
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.innerWidth < 768;
  };

  // ตรวจสอบ redirect result เมื่อกลับมาจากหน้า login (สำหรับ Mobile)
  useEffect(() => {
    const checkRedirectResult = async () => {
      console.log('🔍 Checking redirect result...');
      try {
        const result = await getRedirectResult(auth);
        console.log('📊 Redirect result:', result);
        
        if (result && result.user) {
          console.log('✅ Login successful (redirect):', result.user);
          console.log('👤 User info:', {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
          });
          onLoginSuccess(result.user);
        } else {
          console.log('ℹ️ No redirect result found');
        }
      } catch (error) {
        console.error('❌ Redirect login error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        if (error.code !== 'auth/popup-closed-by-user') {
          alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ: ' + error.message);
        }
      } finally {
        setLoading(false);
        setCheckingRedirect(false);
        console.log('✓ Redirect check completed');
      }
    };

    checkRedirectResult();
  }, [onLoginSuccess]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      if (isMobile()) {
        // ใช้ redirect สำหรับ Mobile
        console.log('📱 Using redirect method for mobile');
        await signInWithRedirect(auth, googleProvider);
        // หลังจาก redirect จะกลับมาที่ useEffect ด้านบน
      } else {
        // ใช้ popup สำหรับ Desktop
        console.log('💻 Using popup method for desktop');
        const result = await signInWithPopup(auth, googleProvider);
        console.log('✅ Login successful (popup):', result.user);
        onLoginSuccess(result.user);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ: ' + error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-[#dc2626] to-[#7d1315] px-6 py-4 rounded-xl mb-4">
            <h1 className="text-2xl font-bold text-white">CODME</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">เข้าสู่ระบบเพื่อจัดการหลักสูตร</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#dc2626]"></div>
              <span>กำลังเข้าสู่ระบบ...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>เข้าสู่ระบบด้วย Google</span>
            </>
          )}
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>เฉพาะผู้ดูแลระบบเท่านั้น</p>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN ADMIN DASHBOARD =============
const AdminDashboard = () => {
  // Auth States
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Dashboard States
  const [currentMenu, setCurrentMenu] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({
    course1: [],
    course2: []
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [news, setNews] = useState([
    { id: 1, title: 'ประกาศเปิดรับสมัครหลักสูตรใหม่', date: '2025-10-25', content: 'เรามีหลักสูตรใหม่เปิดให้บริการแล้ว...', status: 'published' },
    { id: 2, title: 'อัพเดทระบบใหม่', date: '2025-10-20', content: 'ระบบได้รับการปรับปรุงให้ดีขึ้น...', status: 'draft' }
  ]);
  const [editingNews, setEditingNews] = useState(null);
  const [showNewsForm, setShowNewsForm] = useState(false);

  // ตรวจสอบสถานะการ Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('🔐 Auth state changed:', currentUser ? '✅ Logged in' : '❌ Not logged in');
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Courses Data
  const courses = [
    { 
      id: 'course1', 
      name: 'หลักสูตรการเขียนโปรแกรม Python',
      courseId: '1'
    },
    { 
      id: 'course2', 
      name: 'หลักสูตรการตลาดดิจิทัลขั้นสูง',
      courseId: '2'
    }
  ];

  // File Upload Handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length > 0) {
      setUploadedFiles(prev => ({
        ...prev,
        [selectedCourse.id]: [...(prev[selectedCourse.id] || []), ...pdfFiles.map(file => ({
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
          uploadDate: new Date().toLocaleDateString('th-TH')
        }))]
      }));
    }
  };

  // Remove File Handler
  const removeFile = (courseId, index) => {
    setUploadedFiles(prev => ({
      ...prev,
      [courseId]: prev[courseId].filter((_, i) => i !== index)
    }));
  };

  // News Handlers
  const handleNewsSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newsData = {
      id: editingNews ? editingNews.id : Date.now(),
      title: formData.get('title'),
      content: formData.get('content'),
      date: new Date().toISOString().split('T')[0],
      status: formData.get('status')
    };

    if (editingNews) {
      setNews(news.map(n => n.id === editingNews.id ? newsData : n));
    } else {
      setNews([newsData, ...news]);
    }
    
    setShowNewsForm(false);
    setEditingNews(null);
  };

  const handleDeleteNews = (id) => {
    if (window.confirm('คุณต้องการลบข่าวนี้ใช่หรือไม่?')) {
      setNews(news.filter(n => n.id !== id));
    }
  };

  const handleEditNews = (newsItem) => {
    setEditingNews(newsItem);
    setShowNewsForm(true);
  };

  // Logout Handlers
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await signOut(auth);
      console.log('✅ Logout successful');
      setUser(null);
      setShowLogoutModal(false);
    } catch (error) {
      console.error('❌ Logout error:', error);
      alert('เกิดข้อผิดพลาดในการออกจากระบบ');
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // Get Menu Display
  const getMenuDisplay = () => {
    if (currentMenu === 'news') {
      return {
        icon: <Newspaper className="mr-3 text-[#dc2626]" size={28} />,
        title: showNewsForm ? (editingNews ? 'แก้ไขข่าวสาร' : 'เขียนข่าวสารใหม่') : 'จัดการข่าวสาร'
      };
    } else if (currentMenu === 'feedback') {
      return {
        icon: <MessageSquare className="mr-3 text-[#dc2626]" size={28} />,
        title: 'จัดการ Feedback'
      };
    } else {
      return {
        icon: <BookOpen className="mr-3 text-[#dc2626]" size={28} />,
        title: selectedCourse ? selectedCourse.name : 'จัดการหลักสูตรทั้งหมด'
      };
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#dc2626] mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // Not Logged In - Show Login Page
  if (!user) {
    return <LoginPage onLoginSuccess={setUser} />;
  }

  // Logged In - Show Dashboard
  const menuDisplay = getMenuDisplay();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Logout Modal */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={user?.displayName || user?.email?.split('@')[0]}
      />

      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        currentMenu={currentMenu} 
        setCurrentMenu={setCurrentMenu} 
        setSelectedCourse={setSelectedCourse}
        setShowNewsForm={setShowNewsForm}
        user={user}
        onLogout={handleLogoutClick}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                {menuDisplay.icon}
                {menuDisplay.title}
              </h2>
            </div>
          </div>
          
          {/* Show user info on mobile */}
          <div className="md:hidden flex items-center space-x-2">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                {user?.displayName?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {currentMenu === 'courses' ? (
            <CourseManagement
              courses={courses}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              uploadedFiles={uploadedFiles}
              handleFileUpload={handleFileUpload}
              removeFile={removeFile}
            />
          ) : currentMenu === 'news' ? (
            <NewsManagement
              news={news}
              showNewsForm={showNewsForm}
              setShowNewsForm={setShowNewsForm}
              editingNews={editingNews}
              setEditingNews={setEditingNews}
              handleNewsSubmit={handleNewsSubmit}
              handleDeleteNews={handleDeleteNews}
              handleEditNews={handleEditNews}
            />
          ) : (
            <FeedbackManagement />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;