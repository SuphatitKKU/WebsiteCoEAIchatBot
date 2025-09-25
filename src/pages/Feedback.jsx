import React, { useState } from "react";
// import "./admission.css"; // ไม่ได้ใช้แล้ว
import assets from "../assets/assets";
import Title from "../components/Title"; // ยังคงใช้ Title component

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
          <svg
            className="w-full h-full fill-current"
            viewBox="0 0 24 24"
          >
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // ในที่นี้จะจำลองการส่งข้อมูล
    console.log("Feedback Submitted:", { 
      name, 
      email, 
      feedbackType, 
      message, 
      rating 
    });
    setSubmitted(true);
    // คุณสามารถเพิ่ม logic สำหรับการส่งข้อมูลจริงไปยัง API ได้ที่นี่
  };

  const resetForm = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    setFeedbackType("general");
    setMessage("");
    setRating(0);
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden py-10 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: "#ffffff",
      }}
    >
      {/* Background images with lighter opacity */}
      <img
        src={assets.bgImage1}
        alt=""
        className="absolute pointer-events-none opacity-70"
        style={{
          width: "700px",
          height: "700px",
          top: "-180px",
          right: "10px",
          zIndex: 0,
        }}
      />
      

      {/* Content wrapper with higher z-index */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <Title
          title="ส่งความคิดเห็นถึงเรา"
          desc="เรารับฟังทุกข้อเสนอแนะเพื่อการพัฒนาที่ดีขึ้น"
        />

        <div
          className="mt-8 p-6 sm:p-8 rounded-xl shadow-2xl border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
          }}
        >
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
              {/* Rating Section */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ให้คะแนนความพึงพอใจโดยรวม *
                </label>
                <StarRating rating={rating} onRatingChange={setRating} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ชื่อ (ไม่บังคับ)
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="กรอกชื่อของคุณ"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    อีเมล (สำหรับติดต่อกลับ, ไม่บังคับ)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="feedbackType"
                  className="block text-sm font-medium text-gray-700"
                >
                  ประเภทความคิดเห็น
                </label>
                <select
                  id="feedbackType"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="general">💬 ทั่วไป</option>
                  <option value="bug">🐛 แจ้งปัญหา/บั๊ก</option>
                  <option value="suggestion">💡 ข้อเสนอแนะ/ปรับปรุง</option>
                  <option value="compliment">👏 คำชม</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  ข้อความของคุณ *
                </label>
                <textarea
                  id="message"
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="แบ่งปันความคิดเห็นของคุณกับเรา..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                >
                  เคลียร์ฟอร์ม
                </button>
                <button
                  type="submit"
                  disabled={!message.trim() || rating === 0}
                  className="px-8 py-3 bg-gradient-to-r from-[#dc2626] to-[#7d1315] text-white rounded-lg hover:from-[#b91c1c] hover:to-[#6b1513] focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ส่งความคิดเห็น 📤
                </button>
              </div>

              {(!message.trim() || rating === 0) && (
                <div className="text-sm text-gray-500 text-center">
                  * กรุณากรอกข้อความและให้คะแนนก่อนส่ง
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </main>
  );
}