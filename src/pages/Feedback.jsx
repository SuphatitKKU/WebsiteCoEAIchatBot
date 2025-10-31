import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import assets from "../assets/assets";
import Title from "../components/Title";

// ⚙️ ตั้งค่า EmailJS
const EMAILJS_SERVICE_ID = "service_0ouzgf9";
const EMAILJS_TEMPLATE_ID = "template_0kghkbr";
const EMAILJS_PUBLIC_KEY = "OF3aExeaYDE0LidPi";

// 📧 รายชื่ออีเมล Admin ทั้งหมด (เปลี่ยนตามต้องการ)
const ADMIN_EMAILS = [
  'suphatitsrichat@gmail.com',
  'suphatit.s@kkumail.com',
  'warunee.i@kkumail.com',
  'konggidagon.o@kkumail.com'
].join(', ');

// Star Rating Component
const StarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`w-8 h-8 focus:outline-none transition-colors duration-200 ${
            star <= (hoverRating || rating)
              ? "text-yellow-400 hover:text-yellow-500"
              : "text-gray-300 hover:text-yellow-300"
          }`}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {rating > 0 ? `${rating}/5 ดาว` : "กรุณาให้คะแนน"}
      </span>
    </div>
  );
};

export default function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("general");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('กรุณาให้คะแนนก่อนส่ง');
      return;
    }

    if (!message.trim()) {
      setError('กรุณากรอกข้อความ');
      return;
    }
    
    setSubmitting(true);
    setError("");
    
    try {
      // 1. บันทึกลง Firestore
      const feedbackDoc = await addDoc(collection(db, 'feedbacks'), {
        name: name.trim() || 'ไม่ระบุชื่อ',
        email: email.trim() || null,
        feedbackType: feedbackType,
        message: message.trim(),
        rating: rating,
        timestamp: serverTimestamp(),
        status: 'unread'
      });
      
      console.log("✅ Feedback saved to Firebase!");

      // 2. ส่งอีเมลผ่าน EmailJS
      const feedbackTypeText = {
        general: "💬 ทั่วไป",
        bug: "🐛 แจ้งปัญหา/บั๊ก",
        suggestion: "💡 ข้อเสนอแนะ/ปรับปรุง",
        compliment: "👏 คำชม",
      };

      const templateParams = {
        email: ADMIN_EMAILS,  // ✅ เปลี่ยนจาก to_email เป็น email ตาม template
        from_name: name.trim() || 'ไม่ระบุชื่อ',
        from_email: email.trim() || 'ไม่ระบุอีเมล',
        feedback_type: feedbackTypeText[feedbackType],
        message: message.trim(),
        rating: rating,
        feedback_id: feedbackDoc.id,
        timestamp: new Date().toLocaleString("th-TH")
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log("✅ Email sent successfully to admins!");
      setSubmitted(true);
      
    } catch (error) {
      console.error("❌ Error:", error);
      
      // แสดง error ที่เฉพาะเจาะจง
      if (error.text) {
        setError(`ส่ง Feedback สำเร็จแต่ส่งอีเมลไม่สำเร็จ: ${error.text}`);
      } else {
        setError('เกิดข้อผิดพลาดในการส่ง Feedback กรุณาลองอีกครั้ง');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    setFeedbackType("general");
    setMessage("");
    setRating(0);
    setError("");
  };

  return (
    <main className="card-wrap" style={{ position: 'relative' }}>
      {/* Background images */}
      <img 
        src={assets.bgImage1} 
        alt="" 
        className="absolute pointer-events-none opacity-70"
        style={{ 
          width: '700px',
          height: '700px',
          top: '-180px', 
          right: '10px',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <Title
          title="ส่งความคิดเห็นถึงเรา"
          desc="เรารับฟังทุกข้อเสนอแนะเพื่อการพัฒนาที่ดีขึ้น"
        />

        <section className="card card-translucent">
          <div className="card-inner">
            {submitted ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    ขอบคุณสำหรับความคิดเห็นของคุณ! 🎉
                  </h2>
                  <p className="text-lg text-gray-600 mb-2">
                    เราได้รับข้อความของคุณแล้วและจะนำไปพิจารณา
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    📧 ทีมงานได้รับการแจ้งเตือนทางอีเมลแล้ว
                  </p>
                  {rating > 0 && (
                    <p className="text-md text-gray-500">
                      คะแนนที่ให้: {rating}/5 ดาว ⭐
                    </p>
                  )}
                </div>
                <button
                  onClick={resetForm}
                  className="px-8 py-3 bg-gradient-to-r from-[#dc2626] to-[#7d1315] text-white rounded-lg hover:from-[#b91c1c] hover:to-[#6b1513] focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  ส่งความคิดเห็นอีกครั้ง
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setError("")}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Rating Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ให้คะแนนความพึงพอใจโดยรวม *
                  </label>
                  <StarRating rating={rating} onRatingChange={setRating} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      ชื่อ (ไม่บังคับ)
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={submitting}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="กรอกชื่อของคุณ"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      อีเมล (สำหรับติดต่อกลับ, ไม่บังคับ)
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={submitting}
                      className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700">
                    ประเภทความคิดเห็น
                  </label>
                  <select
                    id="feedbackType"
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    disabled={submitting}
                    className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="general">💬 ทั่วไป</option>
                    <option value="bug">🐛 แจ้งปัญหา/บั๊ก</option>
                    <option value="suggestion">💡 ข้อเสนอแนะ/ปรับปรุง</option>
                    <option value="compliment">👏 คำชม</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    ข้อความของคุณ *
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={submitting}
                    className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="แบ่งปันความคิดเห็นของคุณกับเรา..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={submitting}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    เคลียร์ฟอร์ม
                  </button>
                  <button
                    type="submit"
                    disabled={!message.trim() || rating === 0 || submitting}
                    className="px-8 py-3 bg-gradient-to-r from-[#dc2626] to-[#7d1315] text-white rounded-lg hover:from-[#b91c1c] hover:to-[#6b1513] focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        กำลังส่ง...
                      </>
                    ) : (
                      <>
                        ส่งความคิดเห็น 📤
                      </>
                    )}
                  </button>
                </div>

                {(!message.trim() || rating === 0) && !submitting && (
                  <div className="text-sm text-gray-500 text-center">
                    * กรุณากรอกข้อความและให้คะแนนก่อนส่ง
                  </div>
                )}
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}