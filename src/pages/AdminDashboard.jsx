import React, { useState, useEffect } from 'react';
import {
  BookText, Bot, Settings, ChevronLeft, Menu,
  Bold, Italic, Strikethrough, List, ListOrdered, Heading2, PlusCircle, Edit, Trash2
} from 'lucide-react';

// Simple Router Implementation
const Router = ({ children }) => {
  return <div>{children}</div>;
};

const Routes = ({ children }) => {
  const [currentPath, setCurrentPath] = useState('/courses');
  
  React.useEffect(() => {
    // Listen for path changes from Link components
    const handlePathChange = (event) => {
      setCurrentPath(event.detail.path);
    };
    
    window.addEventListener('navigate', handlePathChange);
    return () => window.removeEventListener('navigate', handlePathChange);
  }, []);

  const activeRoute = React.Children.toArray(children).find(child => {
    if (child.props.path === currentPath) return true;
    if (child.props.path.includes(':id') && currentPath.includes('/edit/')) return true;
    return false;
  });

  return activeRoute || children[0];
};

const Route = ({ element }) => {
  return element;
};

const Link = ({ to, children, className }) => {
  const handleClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path: to } }));
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

const useParams = () => {
  const [currentPath] = useState(window.location.hash.slice(1) || '/courses');
  const match = currentPath.match(/\/courses\/edit\/(\d+)/);
  return { id: match ? match[1] : null };
};

const useNavigate = () => {
  return (path) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }));
  };
};

// Simple Rich Text Editor Implementation
const useEditor = ({ extensions, content, editorProps }) => {
  const [editorContent, setEditorContent] = useState(content);
  const [activeFormats, setActiveFormats] = useState({});

  const editor = {
    getHTML: () => editorContent,
    commands: {
      setContent: (newContent) => setEditorContent(newContent),
      focus: () => ({
        toggleHeading: ({ level }) => ({ run: () => toggleFormat('heading') }),
        toggleBold: () => ({ run: () => toggleFormat('bold') }),
        toggleItalic: () => ({ run: () => toggleFormat('italic') }),
        toggleStrike: () => ({ run: () => toggleFormat('strike') }),
        toggleBulletList: () => ({ run: () => toggleFormat('bulletList') }),
        toggleOrderedList: () => ({ run: () => toggleFormat('orderedList') }),
      })
    },
    chain: () => editor.commands,
    isActive: (format) => activeFormats[format] || false
  };

  const toggleFormat = (format) => {
    setActiveFormats(prev => ({ ...prev, [format]: !prev[format] }));
  };

  return editor;
};

const EditorContent = ({ editor }) => {
  const [content, setContent] = useState(editor.getHTML());

  const handleChange = (e) => {
    setContent(e.target.innerHTML);
    editor.commands.setContent(e.target.innerHTML);
  };

  return (
    <div
      contentEditable
      dangerouslySetInnerHTML={{ __html: content }}
      onInput={handleChange}
      className="prose max-w-none focus:outline-none p-4 bg-white min-h-[250px] border border-gray-300 rounded-b-lg"
      style={{ minHeight: '250px' }}
    />
  );
};

// --- Tiptap Menu Bar Component ---
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const menuItems = [
    { action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), icon: Heading2, active: editor.isActive('heading') },
    { action: () => editor.chain().focus().toggleBold().run(), icon: Bold, active: editor.isActive('bold') },
    { action: () => editor.chain().focus().toggleItalic().run(), icon: Italic, active: editor.isActive('italic') },
    { action: () => editor.chain().focus().toggleStrike().run(), icon: Strikethrough, active: editor.isActive('strike') },
    { action: () => editor.chain().focus().toggleBulletList().run(), icon: List, active: editor.isActive('bulletList') },
    { action: () => editor.chain().focus().toggleOrderedList().run(), icon: ListOrdered, active: editor.isActive('orderedList') },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 bg-gray-50 rounded-t-lg">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          className={`p-2 rounded hover:bg-gray-200 ${item.active ? 'bg-gray-300' : ''}`}
        >
          <item.icon size={18} />
        </button>
      ))}
    </div>
  );
};

// --- Course Editor Component ---
const CourseEditor = ({ onSave, course }) => {
  const [title, setTitle] = useState('');
  const editor = useEditor({
    extensions: [],
    content: '<p>เริ่มต้นเขียนเนื้อหาหลักสูตรของคุณที่นี่...</p>',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none p-4 bg-white min-h-[250px] border border-gray-300 rounded-b-lg',
      },
    },
  });

  useEffect(() => {
    // Reset editor content and title when course prop changes
    if (course) {
      setTitle(course.title || '');
      if (editor?.commands) {
        editor.commands.setContent(course.content || '<p>เริ่มต้นเขียนเนื้อหาหลักสูตรของคุณที่นี่...</p>');
      }
    } else {
      setTitle('');
      if (editor?.commands) {
        editor.commands.setContent('<p>เริ่มต้นเขียนเนื้อหาหลักสูตรของคุณที่นี่...</p>');
      }
    }
  }, [course?.id]); // เปลี่ยนจาก [course, editor] เป็น [course?.id]

  const handleSave = () => {
    if (editor && title) {
      onSave({
        id: course?.id || Date.now(),
        title,
        content: editor.getHTML(),
      });
      alert('บันทึกหลักสูตรเรียบร้อย!');
    } else {
      alert('กรุณากรอกชื่อหลักสูตรและเนื้อหา');
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <BookText size={28} className="mr-3 text-[#9a1518]" />
        {course ? 'แก้ไขหลักสูตร' : 'สร้างหลักสูตรใหม่'}
      </h2>
      <div className="mb-4">
        <label htmlFor="course-title" className="block mb-2 font-semibold text-gray-700">
          ชื่อหลักสูตร
        </label>
        <input
          type="text"
          id="course-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9a1518]/50 focus:border-[#9a1518] transition"
          placeholder="เช่น หลักสูตรการตลาดดิจิทัลเบื้องต้น"
        />
      </div>
      <div>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      <button
        onClick={handleSave}
        className="mt-6 w-full text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
        style={{ backgroundColor: '#e53e3e' }}
      >
        บันทึกหลักสูตร
      </button>
    </div>
  );
};

// --- Course List Component ---
const CourseList = ({ courses, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-2xl shadow-lg">
      {/* Header Section - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <BookText size={24} className="mr-2 sm:mr-3 text-[#9a1518] flex-shrink-0" />
          <span className="sm:block">จัดการหลักสูตรทั้งหมด</span>
        </h2>
        <Link 
          to="/courses/new" 
          className="flex items-center justify-center text-white bg-[#9a1518] px-4 py-2 rounded-lg hover:bg-[#7a1012] transition-colors text-sm sm:text-base whitespace-nowrap"
        >
          <PlusCircle size={18} className="mr-2 flex-shrink-0" />
          เพิ่มหลักสูตรใหม่
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <BookText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg mb-2">ยังไม่มีหลักสูตร</p>
          <p className="text-gray-500 text-sm">เริ่มต้นสร้างหลักสูตรแรกของคุณ</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#9a1518]/20"
            >
              {/* Course Title */}
              <div className="flex-1 mb-3 sm:mb-0 sm:mr-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span>หลักสูตร ID: {course.id}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => navigate(`/courses/edit/${course.id}`)}
                  className="flex items-center justify-center px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  title="แก้ไข"
                >
                  <Edit size={16} className="mr-1" />
                  <span className="hidden sm:inline">แก้ไข</span>
                </button>
                <button
                  onClick={() => onDelete(course.id)}
                  className="flex items-center justify-center px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  title="ลบ"
                >
                  <Trash2 size={16} className="mr-1" />
                  <span className="hidden sm:inline">ลบ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- AI Settings Component ---
const AISettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [aiModel, setAiModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState(0.7);

  const primaryColor = '#9a1518';

  const handleSaveSettings = () => {
    alert('บันทึกการตั้งค่า AI เรียบร้อย!');
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <Bot size={28} className="mr-3 text-[#9a1518]" />
        ตั้งค่า AI
      </h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="api-key" className="block mb-2 font-semibold text-gray-700">
            API Key
          </label>
          <input
            type="password"
            id="api-key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9a1518]/50 focus:border-[#9a1518] transition"
            placeholder="ใส่ API Key ของคุณที่นี่"
          />
          <p className="text-xs text-gray-500 mt-1">API Key ของคุณจะถูกเก็บไว้อย่างปลอดภัย</p>
        </div>
        <div>
          <label htmlFor="ai-model" className="block mb-2 font-semibold text-gray-700">
            เลือกโมเดล AI
          </label>
          <select
            id="ai-model"
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9a1518]/50 focus:border-[#9a1518] transition"
          >
            <option>gpt-4</option>
            <option>gpt-3.5-turbo</option>
            <option>claude-3-opus</option>
          </select>
        </div>
        <div>
          <label htmlFor="temperature" className="block mb-2 font-semibold text-gray-700">
            Temperature: <span className="font-normal text-[#9a1518]">{temperature}</span>
          </label>
          <input
            type="range"
            id="temperature"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">ค่าที่ต่ำจะทำให้ AI ตอบแบบตรงไปตรงมา, ค่าที่สูงจะทำให้ AI มีความคิดสร้างสรรค์มากขึ้น</p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="w-full text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
          style={{ backgroundColor: primaryColor }}
        >
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
};

// --- General Settings Component ---
const GeneralSettings = () => {
  const primaryColor = '#9a1518';
  const handleSaveGeneralSettings = () => {
    alert('บันทึกการตั้งค่าทั่วไปเรียบร้อย!');
  };
  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <Settings size={28} className="mr-3 text-[#9a1518]" />
        ตั้งค่าทั่วไป
      </h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="site-name" className="block mb-2 font-semibold text-gray-700">
            ชื่อเว็บไซต์
          </label>
          <input
            type="text"
            id="site-name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9a1518]/50 focus:border-[#9a1518] transition"
            placeholder="ชื่อเว็บไซต์ของคุณ"
          />
        </div>
        <button
          onClick={handleSaveGeneralSettings}
          className="w-full text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
          style={{ backgroundColor: primaryColor }}
        >
          บันทึกการตั้งค่าทั่วไป
        </button>
      </div>
    </div>
  );
};

// Wrapper component to handle course fetching for editing
const EditCourseWrapper = ({ courses, onSave }) => {
  const { id } = useParams();
  const course = courses.find(c => c.id === parseInt(id));

  if (!course) {
    return <div className="p-8 bg-white rounded-2xl shadow-lg text-center text-red-500">ไม่พบหลักสูตรนี้</div>;
  }

  return <CourseEditor onSave={onSave} course={course} />;
};

// --- Main Admin Dashboard Component ---
const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState('/courses');
  
  // ตัวอย่างข้อมูลหลักสูตร
  const [courses, setCourses] = useState([
    { id: 1, title: 'หลักสูตรการเขียนโปรแกรม Python', content: '<p><b>Python</b> เป็นภาษาโปรแกรมที่ได้รับความนิยมอย่างมาก</p><p>บทเรียนนี้จะสอนพื้นฐานของ Python</p><ul><li>ตัวแปร</li><li>การควบคุมการไหล</li><li>ฟังก์ชัน</li></ul>' },
    { id: 2, title: 'หลักสูตรการตลาดดิจิทัลขั้นสูง', content: '<p>เจาะลึกกลยุทธ์ <b>การตลาดดิจิทัล</b> สำหรับธุรกิจ</p><p>หัวข้อหลัก:</p><ol><li>SEO ขั้นสูง</li><li>โฆษณาบนโซเชียลมีเดีย</li><li>การวิเคราะห์ข้อมูล</li></ol>' },
  ]);

  const navigate = (path) => {
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePathChange = (event) => {
      setCurrentPath(event.detail.path);
    };
    
    window.addEventListener('navigate', handlePathChange);
    return () => window.removeEventListener('navigate', handlePathChange);
  }, []);

  const handleSaveCourse = (newCourse) => {
    setCourses(prevCourses => {
      const existingCourseIndex = prevCourses.findIndex(c => c.id === newCourse.id);
      if (existingCourseIndex > -1) {
        // Update existing course
        return prevCourses.map(c => c.id === newCourse.id ? newCourse : c);
      } else {
        // Add new course
        return [...prevCourses, newCourse];
      }
    });
    navigate('/courses'); // กลับไปหน้าหลักสูตรเมื่อบันทึก
  };

  const handleDeleteCourse = (idToDelete) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบหลักสูตรนี้?')) {
      setCourses(prevCourses => prevCourses.filter(course => course.id !== idToDelete));
      alert('ลบหลักสูตรเรียบร้อย!');
    }
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/courses/new':
        return <CourseEditor onSave={handleSaveCourse} />;
      case '/ai-settings':
        return <AISettings />;
      case '/general-settings':
        return <GeneralSettings />;
      default:
        if (currentPath.includes('/courses/edit/')) {
          const id = currentPath.split('/').pop();
          const course = courses.find(c => c.id === parseInt(id));
          if (!course) {
            return <div className="p-8 bg-white rounded-2xl shadow-lg text-center text-red-500">ไม่พบหลักสูตรนี้</div>;
          }
          return <CourseEditor onSave={handleSaveCourse} course={course} />;
        }
        return <CourseList courses={courses} onDelete={handleDeleteCourse} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${isSidebarOpen ? 'w-full lg:w-64' : 'w-full lg:w-20'} ${isSidebarOpen ? 'lg:relative' : 'lg:relative'} bg-[#9a1518] text-white flex flex-col lg:h-screen`}>
        <div className="flex items-center justify-between p-4 border-b border-white/20">
            <h1 className={`font-bold text-xl lg:text-2xl ${!isSidebarOpen && 'lg:hidden'}`}>Admin</h1>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-white/20">
                {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
        </div>
        <nav className={`flex-1 px-4 py-6 space-y-4 ${!isSidebarOpen && 'lg:block hidden'} lg:block`}>
          <Link to="/courses" className="flex items-center p-3 rounded-lg hover:bg-white/20 transition-colors">
            <BookText size={24} className="flex-shrink-0" />
            <span className={`ml-4 ${!isSidebarOpen && 'lg:hidden'}`}>จัดการหลักสูตร</span>
          </Link>
          <Link to="/ai-settings" className="flex items-center p-3 rounded-lg hover:bg-white/20 transition-colors">
            <Bot size={24} className="flex-shrink-0" />
            <span className={`ml-4 ${!isSidebarOpen && 'lg:hidden'}`}>ตั้งค่า AI</span>
          </Link>
          <Link to="/general-settings" className="flex items-center p-3 rounded-lg hover:bg-white/20 transition-colors">
            <Settings size={24} className="flex-shrink-0" />
            <span className={`ml-4 ${!isSidebarOpen && 'lg:hidden'}`}>ตั้งค่าทั่วไป</span>
          </Link>
        </nav>
        <div className={`p-4 border-t border-white/20 ${!isSidebarOpen && 'lg:block hidden'} lg:block`}>
            <div className={`flex items-center ${!isSidebarOpen && 'lg:justify-center'}`}>
                <img src="https://i.pravatar.cc/40" alt="Admin" className="rounded-full w-8 h-8 lg:w-10 lg:h-10"/>
                <div className={`ml-3 ${!isSidebarOpen && 'lg:hidden'}`}>
                    <p className="font-semibold text-sm lg:text-base">Admin User</p>
                    <p className="text-xs lg:text-sm text-white/70">Administrator</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderCurrentPage()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;