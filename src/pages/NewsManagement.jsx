import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronLeft, Upload, X, Loader, Save, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { getAllNews, createNews, updateNews, deleteNews } from '../firebase/newsService';
import { compressImage, isImageFile, formatFileSize } from '../../utils/imageCompression';

// ============ Toast Component ============
const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />
  };

  const styles = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    error: 'bg-gradient-to-r from-red-500 to-rose-600 text-white',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles[type]} rounded-lg shadow-2xl p-4 flex items-center space-x-3 min-w-[300px] max-w-md animate-slide-in`}>
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <div className="flex-1 font-medium">
        {message}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};

// ============ Toast Container ============
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// ============ Confirm Dialog ============
const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">ยืนยันการลบ</h3>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md"
          >
            ใช่, ลบเลย
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  
  // Toast & Confirm State
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'ฝ่ายประชาสัมพันธ์',
    category: 'ทั่วไป',
    status: 'draft'
  });

  // หมวดหมู่ข่าว
  const categories = [
    'กิจกรรม',
    'ความสำเร็จ',
    'ประกาศ',
    'อบรม',
    'ความร่วมมือ',
    'สัมมนา',
    'ทุนวิจัย',
    'กิจกรรมอาสา',
    'ทั่วไป'
  ];

  // ============ Toast Functions ============
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showConfirm = (message) => {
    return new Promise((resolve) => {
      setConfirmDialog({ message, resolve });
    });
  };

  const handleConfirmResponse = (result) => {
    if (confirmDialog) {
      confirmDialog.resolve(result);
      setConfirmDialog(null);
    }
  };

  // โหลดข่าวทั้งหมดเมื่อ component mount
  useEffect(() => {
    loadNews();
  }, []);

  // อัพเดท form เมื่อแก้ไขข่าว
  useEffect(() => {
    if (editingNews) {
      setFormData({
        title: editingNews.title || '',
        content: editingNews.content || '',
        author: editingNews.author || 'ฝ่ายประชาสัมพันธ์',
        category: editingNews.category || 'ทั่วไป',
        status: editingNews.status || 'draft'
      });
      setImagePreview(editingNews.image);
    } else {
      resetForm();
    }
  }, [editingNews]);

  // โหลดข่าวจาก Firebase
  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await getAllNews();
      setNews(data);
    } catch (error) {
      console.error('Error loading news:', error);
      showToast('ไม่สามารถโหลดข่าวได้: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // รีเซ็ตฟอร์ม
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: 'ฝ่ายประชาสัมพันธ์',
      category: 'ทั่วไป',
      status: 'draft'
    });
    setImagePreview(null);
  };

  // จัดการอัปโหลดรูปภาพ (บีบอัดอัตโนมัติ)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ตรวจสอบประเภทไฟล์
    if (!isImageFile(file)) {
      showToast('กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, GIF, WEBP)', 'error');
      return;
    }

    const originalSize = formatFileSize(file.size);
    console.log('📸 Original image size:', originalSize);

    try {
      setCompressing(true);

      // บีบอัดรูปอัตโนมัติ
      const compressedImage = await compressImage(file, {
        maxWidth: 1200,        // ความกว้างสูงสุด
        maxHeight: 800,        // ความสูงสูงสุด
        quality: 0.85,         // คุณภาพ 85%
        maxSizeKB: 400         // ขนาดไม่เกิน 400KB
      });

      setImagePreview(compressedImage);
      
      // แสดงข้อความสำเร็จ
      const compressedSize = Math.round((compressedImage.length * 3) / 4 / 1024);
      console.log(`✅ Compressed to: ${compressedSize}KB`);
      showToast('บีบอัดรูปภาพสำเร็จ!', 'success');
      
    } catch (error) {
      console.error('Error compressing image:', error);
      showToast('ไม่สามารถประมวลผลรูปภาพได้: ' + error.message, 'error');
    } finally {
      setCompressing(false);
    }
  };

  // ลบรูปภาพ
  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  // บันทึกข่าว (เพิ่มหรือแก้ไข)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
      return;
    }

    setSaving(true);

    try {
      const newsData = {
        ...formData,
        image: imagePreview || null
      };

      if (editingNews) {
        // แก้ไขข่าว
        await updateNews(editingNews.id, newsData);
        showToast('แก้ไขข่าวสำเร็จ!', 'success');
      } else {
        // สร้างข่าวใหม่
        await createNews(newsData);
        showToast('เพิ่มข่าวสำเร็จ!', 'success');
      }

      // รีโหลดข่าวและปิดฟอร์ม
      await loadNews();
      handleCloseForm();
    } catch (error) {
      console.error('Error saving news:', error);
      showToast('เกิดข้อผิดพลาด: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ลบข่าว
  const handleDeleteNews = async (newsId) => {
    const confirmed = await showConfirm('คุณแน่ใจหรือไม่ว่าต้องการลบข่าวนี้?');
    
    if (!confirmed) {
      return;
    }

    try {
      await deleteNews(newsId);
      showToast('ลบข่าวสำเร็จ!', 'success');
      await loadNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      showToast('ไม่สามารถลบข่าวได้: ' + error.message, 'error');
    }
  };

  // เปิดฟอร์มแก้ไข
  const handleEditNews = (item) => {
    setEditingNews(item);
    setShowNewsForm(true);
  };

  // ปิดฟอร์ม
  const handleCloseForm = () => {
    setShowNewsForm(false);
    setEditingNews(null);
    resetForm();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} color="#dc2626" />
          <p className="text-gray-600 text-lg">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* CSS Animations */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={() => handleConfirmResponse(true)}
          onCancel={() => handleConfirmResponse(false)}
        />
      )}

      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
            📰 จัดการข่าวสาร
          </h1>

          {!showNewsForm ? (
            // หน้ารายการข่าว
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <p className="text-gray-600">
                  จำนวนข่าวทั้งหมด: <span className="font-bold text-[#dc2626]">{news.length}</span> รายการ
                </p>
                <button
                  onClick={() => {
                    setEditingNews(null);
                    setShowNewsForm(true);
                  }}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#dc2626] to-[#7d1315] text-white rounded-lg hover:opacity-90 transition-opacity shadow-md font-medium"
                >
                  <Plus size={20} />
                  <span>เขียนข่าวใหม่</span>
                </button>
              </div>

              {news.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 text-lg mb-4">ยังไม่มีข่าวสารในระบบ</p>
                  <button
                    onClick={() => setShowNewsForm(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-[#dc2626] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus size={20} />
                    <span>สร้างข่าวแรก</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map(item => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden hover:-translate-y-1"
                    >
                      {item.image && (
                        <div className="w-full h-48 overflow-hidden bg-gray-100">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-800 flex-1 pr-2 line-clamp-2">
                            {item.title}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                            item.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status === 'published' ? '✅ เผยแพร่' : '📝 ฉบับร่าง'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                            {item.category}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.excerpt || item.content}
                        </p>
                        
                        <p className="text-gray-400 text-xs mb-4">
                          📅 {item.date} • ✍️ {item.author}
                        </p>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditNews(item)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <Edit size={16} />
                            <span>แก้ไข</span>
                          </button>
                          <button
                            onClick={() => handleDeleteNews(item.id)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                          >
                            <Trash2 size={16} />
                            <span>ลบ</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // หน้าฟอร์มเขียนข่าว
            <div>
              <button
                onClick={handleCloseForm}
                className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors group"
              >
                <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">กลับ</span>
              </button>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-4xl">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                  {editingNews ? '✏️ แก้ไขข่าว' : '📝 เขียนข่าวใหม่'}
                </h2>

                <form onSubmit={handleSubmit}>
                  {/* รูปภาพประกอบข่าว */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      🖼️ รูปภาพประกอบข่าว (ไม่บังคับ)
                    </label>
                    
                    {!imagePreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#dc2626] transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={compressing}
                        />
                        <label 
                          htmlFor="image-upload"
                          className={`cursor-pointer flex flex-col items-center ${compressing ? 'opacity-50' : ''}`}
                        >
                          {compressing ? (
                            <>
                              <Loader className="animate-spin text-[#dc2626] mb-2" size={40} />
                              <span className="text-[#dc2626] font-medium">กำลังบีบอัดรูปภาพ...</span>
                              <span className="text-gray-400 text-sm mt-1">กรุณารอสักครู่</span>
                            </>
                          ) : (
                            <>
                              <Upload size={40} className="text-gray-400 mb-2" />
                              <span className="text-gray-600 font-medium">คลิกเพื่ออัปโหลดรูปภาพ</span>
                              <span className="text-gray-400 text-sm mt-1">รองรับไฟล์ JPG, PNG, GIF, WEBP</span>
                              <span className="text-green-600 text-sm mt-2 font-medium">
                                ✨ ระบบจะบีบอัดรูปอัตโนมัติให้ ~400KB
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden border border-gray-300">
                        <img 
                          src={imagePreview} 
                          alt="Preview"
                          className="w-full h-64 object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X size={20} />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full">
                          ✅ รูปพร้อมใช้งาน
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      💡 <strong>ระบบจะบีบอัดรูปอัตโนมัติ</strong> เพื่อให้โหลดเร็วและประหยัดพื้นที่
                    </p>
                  </div>

                  {/* หัวข้อข่าว */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      📌 หัวข้อข่าว <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent"
                      placeholder="ใส่หัวข้อข่าว..."
                    />
                  </div>

                  {/* เนื้อหาข่าว */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      📄 เนื้อหาข่าว <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      required
                      rows="12"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent resize-none"
                      placeholder="เขียนเนื้อหาข่าว..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      ℹ️ Excerpt (ข้อความย่อ) จะถูกสร้างอัตโนมัติจาก 150 ตัวอักษรแรก
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* ผู้เขียน */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        ✍️ ผู้เขียน
                      </label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent"
                      />
                    </div>

                    {/* หมวดหมู่ */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        🏷️ หมวดหมู่
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* สถานะ */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        🔖 สถานะ
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent"
                      >
                        <option value="draft">📝 ฉบับร่าง</option>
                        <option value="published">✅ เผยแพร่</option>
                      </select>
                    </div>
                  </div>

                  {/* ปุ่มบันทึก */}
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#dc2626] to-[#7d1315] text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      {saving ? (
                        <>
                          <Loader className="animate-spin" size={20} />
                          <span>กำลังบันทึก...</span>
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          <span>{editingNews ? 'บันทึกการแก้ไข' : 'เผยแพร่ข่าว'}</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      disabled={saving}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsManagement;