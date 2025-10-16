import React from 'react';

const InitialWelcomeUI = ({ setInputMessage }) => {
  // We can derive primary color directly or pass as prop if truly dynamic
  const primaryColorClass = 'bg-[#9a1518]'; // For buttons and icons

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 px-3">
      <div className="relative">
        <div className={`mt-3 w-20 h-20 bg-gradient-to-br from-[#9a1518] to-[#c41e22] rounded-2xl flex items-center justify-center shadow-xl rotate-6 hover:rotate-12 transition-transform duration-300`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full border-3 border-white animate-pulse"></div>
      </div>

      <div className="text-center space-y-2">
        <h4 className="text-xl font-bold text-gray-800">ยินดีต้อนรับ! 👋</h4>
        <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
          ฉันคือผู้ช่วยอัจฉริยะของสาขาวิศวกรรมคอมพิวเตอร์ และ สื่อดิจิตอล<br />
          <span className="text-[#9a1518] font-semibold">มหาวิทยาลัยขอนแก่น</span>
        </p>
      </div>

      <div className="w-full max-w-xs space-y-2">
        <p className="text-xs text-gray-500 text-center font-medium">คำถามแนะนำ:</p>
        <div className="space-y-1">
          <button
            onClick={() => setInputMessage('วิชาเลือกสำหรับคนที่ชอบเขียนเว็บมีอะไรบ้าง')}
            className="w-full p-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-lg text-xs text-gray-700 text-left transition-all duration-200 border border-gray-200 hover:border-[#9a1518] hover:shadow-md"
          >
            💻 วิชาเลือกสำหรับคนที่ชอบเขียนเว็บ
          </button>
          <button
            onClick={() => setInputMessage('หลักสูตรของคณะมีอะไรบ้าง')}
            className="w-full p-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-lg text-xs text-gray-700 text-left transition-all duration-200 border border-gray-200 hover:border-[#9a1518] hover:shadow-md"
          >
            📚 หลักสูตรของคณะมีอะไรบ้าง
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialWelcomeUI;