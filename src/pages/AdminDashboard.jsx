import React, { useState } from 'react';
import { BookOpen, Newspaper, Menu, MessageSquare } from 'lucide-react';
import Sidebar from './Sidebar';
import CourseManagement from './CourseManagement';
import NewsManagement from './NewsManagement';
import FeedbackManagement from './FeedbackManagement';

const AdminDashboard = () => {
  const [currentMenu, setCurrentMenu] = useState('courses'); // courses, news, feedback
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

  const removeFile = (courseId, index) => {
    setUploadedFiles(prev => ({
      ...prev,
      [courseId]: prev[courseId].filter((_, i) => i !== index)
    }));
  };

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
    if (confirm('คุณต้องการลบข่าวนี้ใช่หรือไม่?')) {
      setNews(news.filter(n => n.id !== id));
    }
  };

  const handleEditNews = (newsItem) => {
    setEditingNews(newsItem);
    setShowNewsForm(true);
  };

  // Function to get menu title and icon
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

  const menuDisplay = getMenuDisplay();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        currentMenu={currentMenu} 
        setCurrentMenu={setCurrentMenu} 
        setSelectedCourse={setSelectedCourse}
        setShowNewsForm={setShowNewsForm}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center sticky top-0 z-10">
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