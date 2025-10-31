import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Mail, User, Calendar, Filter, Trash2, Eye, X, TrendingUp, RefreshCw } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    byType: {},
    byRating: {}
  });
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load feedbacks from Firebase
  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const q = query(collection(db, 'feedbacks'), orderBy('timestamp', 'desc'));
      const feedbacksSnapshot = await getDocs(q);
      
      const feedbacksData = feedbacksSnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        timestamp: docSnap.data().timestamp?.toDate() || new Date()
      }));
      
      setFeedbacks(feedbacksData);
      calculateStats(feedbacksData);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      setError('ไม่สามารถโหลดข้อมูล Feedback ได้ กรุณาลองอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadFeedbacks();
    setRefreshing(false);
  };

  const calculateStats = (feedbackList) => {
    const total = feedbackList.length;
    const avgRating = total > 0 
      ? feedbackList.reduce((sum, f) => sum + (f.rating || 0), 0) / total 
      : 0;
    
    const byType = feedbackList.reduce((acc, f) => {
      acc[f.feedbackType] = (acc[f.feedbackType] || 0) + 1;
      return acc;
    }, {});
    
    const byRating = feedbackList.reduce((acc, f) => {
      acc[f.rating] = (acc[f.rating] || 0) + 1;
      return acc;
    }, {});
    
    setStats({ total, avgRating, byType, byRating });
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm('คุณต้องการลบ Feedback นี้หรือไม่?')) return;
    
    try {
      setError('');
      await deleteDoc(doc(db, 'feedbacks', id));
      
      const updated = feedbacks.filter(f => f.id !== id);
      setFeedbacks(updated);
      calculateStats(updated);
      setSelectedFeedback(null);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      setError('ไม่สามารถลบ Feedback ได้ กรุณาลองอีกครั้ง');
    }
  };

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, 'feedbacks', id), { status: 'read' });
      
      const updated = feedbacks.map(f => 
        f.id === id ? { ...f, status: 'read' } : f
      );
      setFeedbacks(updated);
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      general: '💬',
      bug: '🐛',
      suggestion: '💡',
      compliment: '👏'
    };
    return icons[type] || '💬';
  };

  const getTypeName = (type) => {
    const names = {
      general: 'ทั่วไป',
      bug: 'แจ้งปัญหา',
      suggestion: 'ข้อเสนอแนะ',
      compliment: 'คำชม'
    };
    return names[type] || 'ทั่วไป';
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    if (filterType !== 'all' && f.feedbackType !== filterType) return false;
    if (filterRating !== 'all' && f.rating !== parseInt(filterRating)) return false;
    return true;
  });

  const StarDisplay = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating}/5</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="text-red-600" size={32} />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  จัดการ Feedback
                </h1>
              </div>
              <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-800 mb-4"></div>
              <p className="text-gray-600">ดูและจัดการความคิดเห็นจากผู้ใช้งาน</p>
            </div>
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              รีเฟรช
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-600 hover:text-red-800"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Feedback ทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <MessageSquare className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">คะแนนเฉลี่ย</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.avgRating.toFixed(1)}</p>
              </div>
              <Star className="text-yellow-400 fill-yellow-400" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">คำชม</p>
                <p className="text-3xl font-bold text-green-600">{stats.byType.compliment || 0}</p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">แจ้งปัญหา</p>
                <p className="text-3xl font-bold text-red-600">{stats.byType.bug || 0}</p>
              </div>
              <span className="text-4xl">🐛</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="text-gray-600" size={20} />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">ประเภท:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">ทั้งหมด</option>
                <option value="general">ทั่วไป</option>
                <option value="bug">แจ้งปัญหา</option>
                <option value="suggestion">ข้อเสนอแนะ</option>
                <option value="compliment">คำชม</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">คะแนน:</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">ทั้งหมด</option>
                <option value="5">5 ดาว</option>
                <option value="4">4 ดาว</option>
                <option value="3">3 ดาว</option>
                <option value="2">2 ดาว</option>
                <option value="1">1 ดาว</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedbacks List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Feedback ทั้งหมด ({filteredFeedbacks.length})
            </h2>
          </div>

          {filteredFeedbacks.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600">
                {feedbacks.length === 0 ? 'ยังไม่มี Feedback' : 'ไม่พบ Feedback ที่ตรงกับเงื่อนไขการค้นหา'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFeedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    feedback.status === 'unread' ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-2xl">{getTypeIcon(feedback.feedbackType)}</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                          {getTypeName(feedback.feedbackType)}
                        </span>
                        {feedback.status === 'unread' && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            ใหม่
                          </span>
                        )}
                        <StarDisplay rating={feedback.rating} />
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 flex-wrap">
                        {feedback.name && feedback.name !== 'ไม่ระบุชื่อ' && (
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{feedback.name}</span>
                          </div>
                        )}
                        {feedback.email && (
                          <div className="flex items-center gap-1">
                            <Mail size={14} />
                            <span>{feedback.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{feedback.timestamp.toLocaleDateString('th-TH')}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 line-clamp-2">{feedback.message}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedFeedback(feedback);
                          if (feedback.status === 'unread') {
                            markAsRead(feedback.id);
                          }
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="ดูรายละเอียด"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => deleteFeedback(feedback.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 backdrop-blur-md bg-white bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">รายละเอียด Feedback</h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{getTypeIcon(selectedFeedback.feedbackType)}</span>
                <div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                    {getTypeName(selectedFeedback.feedbackType)}
                  </span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">คะแนนความพึงพอใจ</p>
                <StarDisplay rating={selectedFeedback.rating} />
              </div>

              {selectedFeedback.name && selectedFeedback.name !== 'ไม่ระบุชื่อ' && (
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <User size={16} />
                    ชื่อผู้ส่ง
                  </p>
                  <p className="text-gray-800 font-medium">{selectedFeedback.name}</p>
                </div>
              )}

              {selectedFeedback.email && (
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <Mail size={16} />
                    อีเมล
                  </p>
                  <p className="text-gray-800 font-medium">{selectedFeedback.email}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Calendar size={16} />
                  วันที่ส่ง
                </p>
                <p className="text-gray-800 font-medium">
                  {selectedFeedback.timestamp.toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <MessageSquare size={16} />
                  ข้อความ
                </p>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedFeedback.message}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => deleteFeedback(selectedFeedback.id)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  ลบ Feedback
                </button>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;