import React, { useState, useEffect, useRef } from 'react';

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [inputMessage, setInputMessage] = useState(''); // Stores current input
  const [isLoading, setIsLoading] = useState(false); // To show loading state
  const chatContentRef = useRef(null); // Ref for scrolling to bottom

  // Replace with your actual API key
  // **สำคัญ:** ไม่ควรเก็บ API Key ไว้ในโค้ดฝั่ง Client แบบนี้
  // ควรใช้ Backend เพื่อเรียก API และซ่อน API Key ไว้
  // หากจำเป็นต้องใช้ใน Client แนะนำให้ตั้งค่าผ่าน environment variables และ process.env.REACT_APP_GEMINI_API_KEY
  const GEMINI_API_KEY = "AIzaSyCau2OL5taEycCyaeHSygoraPnw96LQU7I"; 
  // Updated to use Gemini 2.0 Flash model
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

  const primaryColor = 'bg-[#9a1518]';
  const primaryHoverColor = 'hover:bg-[#7e1214]';
  const focusRingColor = 'focus:ring-[#9a1518]';

  // Pre-defined responses for specific questions
  const predefinedResponses = {
    webDevelopmentCourse: {
      keywords: ['เขียนเว็บ', 'ทำเว็บ', 'พัฒนาเว็บ', 'web', 'เว็บไซต์', 'วิชาเลือก', 'ลงวิชา'],
      response: 'ตอนปีสามจะมีวิชาเลือกคือ **EN813701 Web Application Development** หากคุณชอบเขียนเว็บแนะนำให้ลงวิชานี้เพราะจะเป็นการสอนการสร้างเว็บไซต์ตั้งแต่พื้นฐาน'
    }
  };

  // Function to check if message matches predefined responses
  const checkPredefinedResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for web development course question
    const webKeywords = predefinedResponses.webDevelopmentCourse.keywords;
    const matchesWebQuestion = webKeywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    
    // Additional check for specific question pattern
    const isAskingAboutCourse = lowerMessage.includes('ควร') && 
                               (lowerMessage.includes('ลง') || lowerMessage.includes('เรียน'));
    
    if (matchesWebQuestion && isAskingAboutCourse) {
      return predefinedResponses.webDevelopmentCourse.response;
    }
    
    return null;
  };

  const toggleChat = () => {
    if (isOpen) {
      // Closing animation
      setIsOpen(false);
      setTimeout(() => setIsVisible(false), 300);
    } else {
      // Opening animation
      setIsVisible(true);
      setTimeout(() => setIsOpen(true), 10);
    }
  };

  // Scroll to the bottom of the chat window whenever messages update
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessageToGemini = async (text) => {
    if (!text.trim()) return; // ไม่ส่งข้อความว่างเปล่า

    setIsLoading(true);
    
    // อัปเดตข้อความของผู้ใช้ทันที
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: text }]);
    setInputMessage(''); // Clear input after sending

    // Check for predefined responses first
    const predefinedResponse = checkPredefinedResponse(text);
    
    if (predefinedResponse) {
      // Use predefined response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'ai', text: predefinedResponse },
        ]);
        setIsLoading(false);
      }, 1000); // Add slight delay to simulate AI thinking
      return;
    }

    // If no predefined response, continue with Gemini API
    const userMessage = { role: 'user', parts: [{ text: text }] };

    // เพิ่มข้อความทั้งหมดใน History สำหรับ Gemini API
    const history = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            ...history,
            userMessage
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const geminiResponse = data.candidates[0]?.content?.parts[0]?.text;

      if (geminiResponse) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'ai', text: geminiResponse },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'ai', text: 'ขออภัย ไม่ได้รับคำตอบจาก AI' },
        ]);
      }
      
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI หรือ API Key ไม่ถูกต้อง' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessageToGemini(inputMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputMessage.trim() && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* ปุ่มแชท - พร้อม animation */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-4 right-4 ${primaryColor} ${primaryHoverColor} text-white p-4 rounded-full shadow-lg z-50 
                   focus:outline-none focus:ring-2 ${focusRingColor} focus:ring-opacity-50
                   transition-all duration-300 hover:scale-110 active:scale-95`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          )}
        </svg>
      </button>

      {/* หน้าต่างแชท - ปรับขนาดสำหรับ Laptop (sm: เปลี่ยนจาก md เป็น sm) */}
      {isVisible && (
        <div 
          className={`fixed bottom-20 right-4 z-50 flex flex-col
                      w-11/12 sm:w-80 md:w-96 lg:w-96 xl:w-[420px] 
                      h-[calc(100vh-120px)] sm:h-[450px] md:h-[500px] lg:h-[600px] xl:h-[650px]
                      bg-white/90 backdrop-blur-xl rounded-lg shadow-2xl border border-white/30
                      transition-all duration-300 ease-out origin-bottom-right
                      ${isOpen 
                        ? 'opacity-100 scale-100 translate-y-0' 
                        : 'opacity-0 scale-95 translate-y-4'
                      }`}
          style={{
            transform: isOpen 
              ? 'translateY(0px) scale(1)' 
              : 'translateY(16px) scale(0.95)',
            opacity: isOpen ? 1 : 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Header แชท - พร้อม animation */}
          <div className={`p-3 rounded-t-lg flex justify-between items-center ${primaryColor} text-white
                          transform transition-all duration-300 delay-100
                          ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
            <h3 className="text-lg font-semibold">CodMe Ai Chat Bot</h3>
            <button 
              onClick={toggleChat} 
              className="text-white hover:text-gray-200 focus:outline-none
                        transition-all duration-200 hover:rotate-90 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* เนื้อหาแชท - พร้อม slide animation และ blur background */}
          <div 
            ref={chatContentRef} 
            className={`flex-grow p-4 overflow-y-auto flex flex-col space-y-3
                       transform transition-all duration-300 delay-150
                       ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
            style={{
              backgroundColor: 'rgba(249, 250, 251, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            {messages.length === 0 ? (
              <div className={`text-gray-600 text-center mt-auto space-y-2
                            transform transition-all duration-500 delay-300
                            ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <p>สวัสดี! มีอะไรให้ช่วยไหม?</p>
                <p className="text-sm text-gray-500">ลองถามเกี่ยวกับวิชาเลือกสำหรับคนที่ชอบเขียนเว็บดูสิ</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}
                             transform transition-all duration-300 ease-out
                             ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                  style={{
                    transitionDelay: `${200 + index * 50}ms`
                  }}
                >
                  <div
                    className={`max-w-[75%] p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 ${
                      msg.sender === 'user'
                        ? `${primaryColor} text-white hover:shadow-xl backdrop-blur-sm`
                        : 'bg-white/80 text-gray-800 hover:bg-white/90 backdrop-blur-sm border border-white/30'
                    }`}
                    style={{
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div 
                  className="bg-white/80 text-gray-800 p-2 rounded-lg shadow-lg animate-pulse
                             transform transition-all duration-300 slide-in-left backdrop-blur-sm border border-white/30"
                  style={{
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input สำหรับพิมพ์ข้อความ - พร้อม slide animation และ blur effect */}
          <div 
            className={`p-3 flex space-x-3
                        transform transition-all duration-300 delay-200
                        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <input
              type="text"
              placeholder="พิมพ์ข้อความของคุณ..."
              className={`flex-grow p-2 rounded-md 
                         focus:outline-none focus:ring-2 ${focusRingColor}
                         transition-all duration-200 focus:scale-105 focus:shadow-lg
                         bg-white/60 backdrop-blur-sm border border-white/40 text-gray-800
                         placeholder-gray-500`}
              style={{
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className={`flex-shrink-0 ${primaryColor} ${primaryHoverColor} text-white py-2 px-4 rounded-md 
                         focus:outline-none focus:ring-2 ${focusRingColor} focus:ring-opacity-50
                         transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95
                         backdrop-blur-sm
                         ${isLoading || !inputMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              disabled={isLoading || !inputMessage.trim()}
            >
              <span className="transition-all duration-200">
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'ส่ง'
                )}
              </span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .slide-in-left {
          animation: slideInLeft 0.3s ease-out;
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default ChatButton;