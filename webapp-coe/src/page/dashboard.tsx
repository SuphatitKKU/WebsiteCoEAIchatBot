// AdminDashboard.tsx
import React, { useState } from 'react';
import './AdminDashboard.css'; 
//hello
import {
    Users,
    MessageCircle,
    BookOpen,
    BarChart3,
    Settings,
    Bell,
    Search,
    Menu,
    X,
    Plus,
    Eye,
    Edit,
    Trash2,
    TrendingUp,
    Calendar,
    Filter,
    Download,
    Bot,
    UserCheck,
    AlertCircle,
    ChevronRight
} from 'lucide-react';

interface Chat {
    id: number;
    student: string;
    course: string;
    time: string;
    status: 'resolved' | 'pending';
}

interface Course {
    id: number;
    name: string;
    inquiries: number;
    satisfaction: number;
}

interface CourseData {
    id: number;
    name: string;
    faculty: string;
    code: string;
    duration: string;
    tuition: string;
    status: 'active' | 'draft' | 'inactive';
    inquiries: number;
    satisfaction: number;
    description: string;
    requirements: string;
    createdAt: string;
}

interface Stats {
    totalStudents: number;
    activeCourses: number;
    chatInteractions: number;
    responseRate: number;
}

interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
}

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    // Sample data
    const stats: Stats = {
        totalStudents: 2847,
        activeCourses: 45,
        chatInteractions: 12540,
        responseRate: 95.8
    };

    const recentChats: Chat[] = [
        { id: 1, student: 'สมชาย ใจดี', course: 'วิศวกรรมคอมพิวเตอร์', time: '5 นาที', status: 'resolved' },
        { id: 2, student: 'สุมาลี แสงแก้ว', course: 'บริหารธุรกิจ', time: '12 นาที', status: 'pending' },
        { id: 3, student: 'อนุชา มั่นคง', course: 'การแพทย์', time: '25 นาที', status: 'resolved' },
        { id: 4, student: 'นิดา รักเรียน', course: 'พยาบาลศาสตร์', time: '1 ชั่วโมง', status: 'resolved' }
    ];

    const courses: Course[] = [
        { id: 1, name: 'วิศวกรรมคอมพิวเตอร์', inquiries: 245, satisfaction: 4.8 },
        { id: 2, name: 'การแพทย์', inquiries: 189, satisfaction: 4.9 },
        { id: 3, name: 'บริหารธุรกิจ', inquiries: 167, satisfaction: 4.7 },
        { id: 4, name: 'พยาบาลศาสตร์', inquiries: 134, satisfaction: 4.8 },
        { id: 5, name: 'สถาปัตยกรรม', inquiries: 98, satisfaction: 4.6 }
    ];

    const coursesData: CourseData[] = [
        {
            id: 1,
            name: 'วิศวกรรมคอมพิวเตอร์',
            faculty: 'คณะวิศวกรรมศาสตร์',
            code: 'CPE',
            duration: '4 ปี',
            tuition: '45000',
            status: 'active',
            inquiries: 245,
            satisfaction: 4.8,
            description: 'เรียนรู้การพัฒนาซอฟต์แวร์ ฮาร์ดแวร์ และระบบเครือข่าย',
            requirements: 'คณิต, ฟิสิกส์, อังกฤษ',
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            name: 'การแพทย์',
            faculty: 'คณะแพทยศาสตร์',
            code: 'MD',
            duration: '6 ปี',
            tuition: '120000',
            status: 'active',
            inquiries: 189,
            satisfaction: 4.9,
            description: 'การศึกษาด้านการแพทย์และการรักษาผู้ป่วย',
            requirements: 'คณิต, ฟิสิกส์, เคมี, ชีววิทยา',
            createdAt: '2024-01-10'
        },
        {
            id: 3,
            name: 'บริหารธุรกิจ',
            faculty: 'คณะบริหารธุรกิจ',
            code: 'BBA',
            duration: '4 ปี',
            tuition: '35000',
            status: 'active',
            inquiries: 167,
            satisfaction: 4.7,
            description: 'การจัดการองค์กร การตลาด และการเงิน',
            requirements: 'คณิต, อังกฤษ, สังคมศึกษา',
            createdAt: '2024-01-08'
        },
        {
            id: 4,
            name: 'พยาบาลศาสตร์',
            faculty: 'คณะพยาบาลศาสตร์',
            code: 'NSG',
            duration: '4 ปี',
            tuition: '55000',
            status: 'active',
            inquiries: 134,
            satisfaction: 4.8,
            description: 'การดูแลผู้ป่วยและการส่งเสริมสุขภาพ',
            requirements: 'คณิต, ฟิสิกส์, เคมี, ชีววิทยา',
            createdAt: '2024-01-05'
        },
        {
            id: 5,
            name: 'สถาปัตยกรรม',
            faculty: 'คณะสถาปัตยกรรมศาสตร์',
            code: 'ARCH',
            duration: '5 ปี',
            tuition: '65000',
            status: 'draft',
            inquiries: 98,
            satisfaction: 4.6,
            description: 'การออกแบบอาคารและการวางผังเมือง',
            requirements: 'คณิต, ฟิสิกส์, ศิลปะ',
            createdAt: '2024-01-03'
        }
    ];

    const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
    const [showCourseModal, setShowCourseModal] = useState<boolean>(false);
    const [courseSearchTerm, setCourseSearchTerm] = useState<string>('');
    const [courseFilter, setCourseFilter] = useState<string>('all');

    const menuItems: MenuItem[] = [
        { id: 'dashboard', label: 'แดชบอร์ด', icon: BarChart3 },
        { id: 'chats', label: 'การสนทนา', icon: MessageCircle },
        { id: 'courses', label: 'หลักสูตร', icon: BookOpen },
        { id: 'users', label: 'ผู้ใช้งาน', icon: Users },
        { id: 'bot', label: 'จัดการ AI', icon: Bot },
        { id: 'settings', label: 'ตั้งค่า', icon: Settings }
    ];

    const renderDashboard = () => (
        <div className="grid-responsive">
            {/* Stats Cards */}
            <div className="grid-responsive grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <div className="stats-card-students text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100">นักเรียนทั้งหมด</p>
                            <p className="text-3xl font-bold">{stats.totalStudents.toLocaleString()}</p>
                        </div>
                        <Users className="w-10 h-10 text-red-200" />
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>+12% จากเดือนที่แล้ว</span>
                    </div>
                </div>

                <div className="stats-card-courses text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">หลักสูตรที่เปิด</p>
                            <p className="text-3xl font-bold">{stats.activeCourses}</p>
                        </div>
                        <BookOpen className="w-10 h-10 text-green-200" />
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>+3 หลักสูตรใหม่</span>
                    </div>
                </div>

                <div className="stats-card-chats text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100">การสนทนาทั้งหมด</p>
                            <p className="text-3xl font-bold">{stats.chatInteractions.toLocaleString()}</p>
                        </div>
                        <MessageCircle className="w-10 h-10 text-purple-200" />
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>+8% สัปดาห์นี้</span>
                    </div>
                </div>

                <div className="stats-card-response text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100">อัตราตอบกลับ</p>
                            <p className="text-3xl font-bold">{stats.responseRate}%</p>
                        </div>
                        <UserCheck className="w-10 h-10 text-orange-200" />
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>เพิ่มขึ้น 2.3%</span>
                    </div>
                </div>
            </div>

            {/* Recent Chats and Popular Courses */}
            <div className="grid-responsive grid-cols-1 lg:grid-cols-2">
                {/* Recent Chats */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">การสนทนาล่าสุด</h3>
                        <button className="text-sm text-red-600 hover:text-red-800">ดูทั้งหมด</button>
                    </div>
                    <div className="space-y-4">
                        {recentChats.map(chat => (
                            <div key={chat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{chat.student}</p>
                                    <p className="text-sm text-gray-600">{chat.course}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">{chat.time}</p>
                                    <span className={`status-badge ${chat.status === 'resolved' ? 'status-resolved' : 'status-pending'}`}>
                                        {chat.status === 'resolved' ? 'แก้ไขแล้ว' : 'รอดำเนินการ'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Courses */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">หลักสูตรที่ได้รับความสนใจ</h3>
                        <button className="text-sm text-red-600 hover:text-red-800">ดูทั้งหมด</button>
                    </div>
                    <div className="space-y-4">
                        {courses.map((course, index) => (
                            <div key={course.id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="ranking-number">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{course.name}</p>
                                        <p className="text-sm text-gray-600">{course.inquiries} คำถาม</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center">
                                        <span className="star-rating">★</span>
                                        <span className="text-sm font-medium ml-1">{course.satisfaction}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCoursesManagement = () => {
        const filteredCourses = coursesData.filter(course => {
            const matchesSearch = course.name.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
                course.faculty.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
                course.code.toLowerCase().includes(courseSearchTerm.toLowerCase());
            const matchesFilter = courseFilter === 'all' || course.status === courseFilter;
            return matchesSearch && matchesFilter;
        });

        return (
            <div className="grid-responsive">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                        <h2 className="text-xl font-semibold">จัดการหลักสูตร</h2>
                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                            <div className="search-input-container">
                                <Search className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาหลักสูตร..."
                                    value={courseSearchTerm}
                                    onChange={(e) => setCourseSearchTerm(e.target.value)}
                                    className="form-input search-input w-full md:w-64"
                                />
                            </div>
                            <select
                                value={courseFilter}
                                onChange={(e) => setCourseFilter(e.target.value)}
                                className="form-select"
                            >
                                <option value="all">ทั้งหมด</option>
                                <option value="active">เปิดใช้งาน</option>
                                <option value="draft">แบบร่าง</option>
                                <option value="inactive">ปิดใช้งาน</option>
                            </select>
                            <button
                                onClick={() => setShowCourseModal(true)}
                                className="btn-primary flex items-center px-4 py-2 rounded-lg"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                เพิ่มหลักสูตร
                            </button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>หลักสูตร</th>
                                    <th>คณะ</th>
                                    <th>รหัส</th>
                                    <th>ระยะเวลา</th>
                                    <th>ค่าเล่าเรียน</th>
                                    <th>สถานะ</th>
                                    <th>คำถาม</th>
                                    <th>คะแนน</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map(course => (
                                    <tr key={course.id}>
                                        <td>
                                            <div className="text-sm font-medium text-gray-900">{course.name}</div>
                                        </td>
                                        <td>
                                            <div className="text-sm text-gray-900">{course.faculty}</div>
                                        </td>
                                        <td>
                                            <span className="status-badge bg-gray-100 text-gray-800">
                                                {course.code}
                                            </span>
                                        </td>
                                        <td className="text-sm text-gray-900">
                                            {course.duration}
                                        </td>
                                        <td className="text-sm text-gray-900">
                                            ฿{parseInt(course.tuition).toLocaleString()}/ปี
                                        </td>
                                        <td>
                                            <span className={`status-badge ${
                                                course.status === 'active' ? 'status-active' :
                                                course.status === 'draft' ? 'status-draft' : 'status-inactive'
                                            }`}>
                                                {course.status === 'active' ? 'เปิดใช้งาน' : 
                                                 course.status === 'draft' ? 'แบบร่าง' : 'ปิดใช้งาน'}
                                            </span>
                                        </td>
                                        <td className="text-sm text-gray-900">
                                            {course.inquiries}
                                        </td>
                                        <td className="text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <span className="star-rating">★</span>
                                                <span className="ml-1">{course.satisfaction}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCourse(course);
                                                        setShowCourseModal(true);
                                                    }}
                                                    className="action-button action-view"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedCourse(course);
                                                        setShowCourseModal(true);
                                                    }}
                                                    className="action-button action-edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="action-button action-delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="empty-state">
                            <BookOpen className="empty-state-icon" />
                            <p>ไม่พบหลักสูตรที่ตรงกับเงื่อนไข</p>
                        </div>
                    )}
                </div>

                {/* Course Statistics */}
                <div className="grid-responsive grid-cols-1 md:grid-cols-3">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">หลักสูตรทั้งหมด</p>
                                <p className="text-2xl font-bold text-gray-900">{coursesData.length}</p>
                            </div>
                            <BookOpen className="w-8 h-8 text-red-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">หลักสูตรเปิดใช้งาน</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {coursesData.filter(c => c.status === 'active').length}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">คะแนนเฉลี่ย</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {(coursesData.reduce((acc, course) => acc + course.satisfaction, 0) / coursesData.length).toFixed(1)}
                                </p>
                            </div>
                            <div className="star-rating text-2xl">★</div>
                        </div>
                    </div>
                </div>

                {/* Course Modal */}
                {showCourseModal && (
                    <div className="modal-overlay">
                        <div className="modal-container">
                            <div className="modal-content">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold">
                                        {selectedCourse ? 'แก้ไขหลักสูตร' : 'เพิ่มหลักสูตรใหม่'}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowCourseModal(false);
                                            setSelectedCourse(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อหลักสูตร</label>
                                        <input
                                            type="text"
                                            defaultValue={selectedCourse ? selectedCourse.name : ''}
                                            className="form-input w-full px-3 py-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">คณะ</label>
                                            <select
                                                defaultValue={selectedCourse ? selectedCourse.faculty : ''}
                                                className="form-select w-full px-3 py-2"
                                            >
                                                <option value="">เลือกคณะ</option>
                                                <option value="คณะวิศวกรรมศาสตร์">คณะวิศวกรรมศาสตร์</option>
                                                <option value="คณะแพทยศาสตร์">คณะแพทยศาสตร์</option>
                                                <option value="คณะบริหารธุรกิจ">คณะบริหารธุรกิจ</option>
                                                <option value="คณะพยาบาลศาสตร์">คณะพยาบาลศาสตร์</option>
                                                <option value="คณะสถาปัตยกรรมศาสตร์">คณะสถาปัตยกรรมศาสตร์</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสหลักสูตร</label>
                                            <input
                                                type="text"
                                                defaultValue={selectedCourse ? selectedCourse.code : ''}
                                                className="form-input w-full px-3 py-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">ระยะเวลาศึกษา</label>
                                            <select
                                                defaultValue={selectedCourse ? selectedCourse.duration : ''}
                                                className="form-select w-full px-3 py-2"
                                            >
                                                <option value="">เลือกระยะเวลา</option>
                                                <option value="4 ปี">4 ปี</option>
                                                <option value="5 ปี">5 ปี</option>
                                                <option value="6 ปี">6 ปี</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">ค่าเล่าเรียน/ปี</label>
                                            <input
                                                type="number"
                                                defaultValue={selectedCourse ? selectedCourse.tuition : ''}
                                                className="form-input w-full px-3 py-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบายหลักสูตร</label>
                                        <textarea
                                            rows={3}
                                            defaultValue={selectedCourse ? selectedCourse.description : ''}
                                            className="form-input w-full px-3 py-2"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">วิชาที่ต้องมี</label>
                                        <input
                                            type="text"
                                            defaultValue={selectedCourse ? selectedCourse.requirements : ''}
                                            placeholder="เช่น คณิต, ฟิสิกส์, เคมี"
                                            className="form-input w-full px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                                        <select
                                            defaultValue={selectedCourse ? selectedCourse.status : 'draft'}
                                            className="form-select w-full px-3 py-2"
                                        >
                                            <option value="draft">แบบร่าง</option>
                                            <option value="active">เปิดใช้งาน</option>
                                            <option value="inactive">ปิดใช้งาน</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={() => {
                                            setShowCourseModal(false);
                                            setSelectedCourse(null);
                                        }}
                                        className="btn-secondary px-4 py-2 rounded-lg"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button className="btn-primary px-4 py-2 rounded-lg">
                                        {selectedCourse ? 'บันทึกการแก้ไข' : 'เพิ่มหลักสูตร'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderChatsManagement = () => (
        <div className="grid-responsive">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                    <h2 className="text-xl font-semibold">จัดการการสนทนา</h2>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                        <div className="search-input-container">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="ค้นหาการสนทนา..."
                                className="form-input search-input w-full md:w-64"
                            />
                        </div>
                        <select className="form-select px-4 py-2">
                            <option value="all">ทุกสถานะ</option>
                            <option value="pending">รอดำเนินการ</option>
                            <option value="resolved">แก้ไขแล้ว</option>
                        </select>
                        <button className="btn-primary flex items-center px-4 py-2 rounded-lg">
                            <Download className="w-4 h-4 mr-2" />
                            ส่งออกข้อมูล
                        </button>
                    </div>
                </div>

                <div className="grid-responsive grid-cols-1 lg:grid-cols-3 mb-6">
                    <div className="stats-card-chats text-white p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">การสนทนาวันนี้</p>
                                <p className="text-2xl font-bold">127</p>
                            </div>
                            <MessageCircle className="w-8 h-8 text-blue-200" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100">รอดำเนินการ</p>
                                <p className="text-2xl font-bold">23</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-yellow-200" />
                        </div>
                    </div>
                    <div className="stats-card-courses text-white p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">เวลาตอบเฉลี่ย</p>
                                <p className="text-2xl font-bold">2.3 นาที</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-200" />
                        </div>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>นักเรียน</th>
                                <th>หลักสูตร</th>
                                <th>หัวข้อ</th>
                                <th>เวลา</th>
                                <th>สถานะ</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentChats.map(chat => (
                                <tr key={chat.id}>
                                    <td>
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                <Users className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{chat.student}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-sm text-gray-900">{chat.course}</td>
                                    <td className="text-sm text-gray-900">สอบถามข้อมูลการรับสมัคร</td>
                                    <td className="text-sm text-gray-500">{chat.time} ที่แล้ว</td>
                                    <td>
                                        <span className={`status-badge ${chat.status === 'resolved' ? 'status-resolved' : 'status-pending'}`}>
                                            {chat.status === 'resolved' ? 'แก้ไขแล้ว' : 'รอดำเนินการ'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="action-button action-view flex items-center px-3 py-1 rounded-lg">
                                            <Eye className="w-4 h-4 mr-1" />
                                            ดูรายละเอียด
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
            case 'courses':
                return renderCoursesManagement();
            case 'chats':
                return renderChatsManagement();
            case 'users':
                return (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="empty-state">
                            <Users className="empty-state-icon" />
                            <h3 className="text-lg font-semibold mb-2">จัดการผู้ใช้งาน</h3>
                            <p className="text-gray-600">ฟีเจอร์นี้กำลังพัฒนา</p>
                        </div>
                    </div>
                );
            case 'bot':
                return (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="empty-state">
                            <Bot className="empty-state-icon" />
                            <h3 className="text-lg font-semibold mb-2">จัดการ AI Chatbot</h3>
                            <p className="text-gray-600">ฟีเจอร์นี้กำลังพัฒนา</p>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="empty-state">
                            <Settings className="empty-state-icon" />
                            <h3 className="text-lg font-semibold mb-2">ตั้งค่าระบบ</h3>
                            <p className="text-gray-600">ฟีเจอร์นี้กำลังพัฒนา</p>
                        </div>
                    </div>
                );
            default:
                return renderDashboard();
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'w-64 expanded' : 'w-16 collapsed'}`}>
                <div className="p-4">
                    <div className="flex items-center">
                        {sidebarOpen && (
                            <div className="flex items-center">
                                <div className="sidebar-brand w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">AI Admin</h2>
                                    <p className="text-sm text-gray-500">ระบบจัดการ</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="ml-auto p-2 rounded-lg hover:bg-gray-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <nav className="mt-8">
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`sidebar-nav-item w-full flex items-center px-4 py-3 text-left ${
                                    activeTab === item.id ? 'active' : ''
                                }`}
                            >
                                <Icon className={`nav-icon w-5 h-5`} />
                                {sidebarOpen && (
                                    <span className={`nav-text ml-3`}>
                                        {item.label}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className={`main-content flex-1 overflow-y-auto`}>
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {menuItems.find(item => item.id === activeTab)?.label}
                            </h1>
                            <p className="text-gray-600">จัดการระบบ AI Chatbot สำหรับมหาวิทยาลัย</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="notification-badge"></span>
                            </button>
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard