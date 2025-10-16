import React, { useState, useEffect, useRef } from 'react';

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [courseCoEData, setCourseCoEData] = useState(''); // Renamed for clarity
  const [courseDMEData, setCourseDMEData] = useState(''); // New state for DME data
  const chatContentRef = useRef(null);
  
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

  const primaryColor = 'bg-[#9a1518]';
  const primaryHoverColor = 'hover:bg-[#7e1214]';
  const focusRingColor = 'focus:ring-[#9a1518]';

  useEffect(() => {
    // Fetch CoE Course Data
    fetch('/WebsiteCoEAIchatBot/data/course_coe.txt')
      .then(res => res.text())
      .then(text => setCourseCoEData(text))
      .catch(err => console.error('Error loading CoE course knowledge:', err));

    // Fetch DME Course Data (New!)
    fetch('/WebsiteCoEAIchatBot/data/course_dme.txt')
      .then(res => res.text())
      .then(text => setCourseDMEData(text))
      .catch(err => console.error('Error loading DME course knowledge:', err));

    // Add initial AI welcome message
    if (messages.length === 0) {
      setMessages([
        { 
          sender: 'ai', 
          text: `สวัสดีครับ! ฉันคือผู้ช่วยอัจฉริยะของสาขาวิศวกรรมคอมพิวเตอร์ และ สื่อดิจิตอล มหาวิทยาลัยขอนแก่น พร้อมให้คำปรึกษาเกี่ยวกับหลักสูตรและวิชาเรียนต่างๆ มีอะไรให้ช่วยไหมครับ?`
        }
      ]);
    }
  }, []); 

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  const formatAIResponse = (text) => {
    let formatted = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const lines = formatted.split('\n');
    let inList = false;
    let result = [];

    for (let line of lines) {
      if (line.trim().startsWith('*') && !line.trim().startsWith('**')) {
        if (!inList) {
          result.push('<ul class="list-disc list-inside space-y-1 mt-2">');
          inList = true;
        }
        const content = line.trim().substring(1).trim();
        result.push(`<li>${content}</li>`);
      } else {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        if (line.trim()) {
          result.push(`<p class="mb-2">${line}</p>`);
        }
      }
    }

    if (inList) result.push('</ul>');

    return result.join('');
  };

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setIsVisible(false), 300);
    } else {
      setIsVisible(true);
      setTimeout(() => setIsOpen(true), 10);
    }
  };

  const sendMessageToGemini = async (text) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputMessage('');

    const baseSystemInstruction = `คุณเป็น AI ผู้ช่วยของสาขาวิศวกรรมคอมพิวเตอร์ และ สื่อดิจิตอล มหาวิทยาลัยขอนแก่น ให้คำแนะนำเกี่ยวกับหลักสูตรและวิชาเรียนต่างๆ`;

    const lowerCaseText = text.toLowerCase();
    const isCourseOrTeacherRelated = lowerCaseText.includes('หลักสูตร') || 
                                     lowerCaseText.includes('วิชา') || 
                                     lowerCaseText.includes('คณะ') ||
                                     lowerCaseText.includes('เรียน') ||
                                     lowerCaseText.includes('สาขา') ||
                                     lowerCaseText.includes('คอมพิวเตอร์') ||
                                     lowerCaseText.includes('ดิจิตอล') ||
                                     lowerCaseText.includes('ภาควิชา') ||
                                     lowerCaseText.includes('อาจารย์') ||
                                     lowerCaseText.includes('ผู้สอน') ||
                                     lowerCaseText.includes('ชื่ออาจารย์') ||
                                     lowerCaseText.includes('ใครสอน');

    let contextData = '';
    // Combine both course data if relevant
    if ((courseCoEData || courseDMEData) && isCourseOrTeacherRelated) {
      contextData = `
ข้อมูลหลักสูตรและวิชาเรียน รวมถึงอาจารย์ผู้สอน:
${courseCoEData ? `--- หลักสูตรวิศวกรรมคอมพิวเตอร์ ---\n${courseCoEData}` : ''}
${courseDMEData ? `--- หลักสูตรสื่อดิจิตอล ---\n${courseDMEData}` : ''}

กรุณาตอบคำถามโดยอ้างอิงจากข้อมูลด้านบนเป็นหลัก ถ้าคำถามไม่เกี่ยวข้องกับข้อมูลที่มี ให้ตอบตามความรู้ทั่วไปแต่แจ้งให้ผู้ใช้ทราบว่าข้อมูลนี้ไม่ได้มาจากฐานข้อมูลหลักสูตร
`;
    } else {
      contextData = ``; 
    }

    const MAX_HISTORY_MESSAGES = 8; 
    const historyForAPI = messages
      .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
      .slice(Math.max(messages.length - MAX_HISTORY_MESSAGES, 0)) 
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
    
    const combinedUserPromptText = `
${baseSystemInstruction}

${contextData}

คำถาม: ${text}
`;

    const contentsToSend = [...historyForAPI, { role: 'user', parts: [{ text: combinedUserPromptText }] }];


    const MAX_RETRIES = 3;
    let attempts = 0;
    let success = false;
    let geminiResponse = 'ขออภัย ไม่ได้รับคำตอบจาก AI';

    while (attempts < MAX_RETRIES && !success) {
      attempts++;
      try {
        const response = await fetch(GEMINI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: contentsToSend, 
            safetySettings: [ 
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
            ]
          })
        });

        if (!response.ok) {
          if (response.status === 429 || response.status >= 500) { 
            console.warn(`Attempt ${attempts} failed with status ${response.status}. Retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); 
            continue;
          }
          throw new Error(`API error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        
        if (data.promptFeedback && data.promptFeedback.blockReason) {
            geminiResponse = `ข้อความของคุณถูกบล็อกโดยระบบความปลอดภัยของ AI: ${data.promptFeedback.blockReason}`;
        } else if (data.candidates?.[0]?.finishReason === 'SAFETY') {
             geminiResponse = `ขออภัย คำตอบของ AI ถูกบล็อกโดยระบบความปลอดภัย`;
        } else {
            geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'ไม่ได้รับคำตอบจาก AI ที่ถูกต้อง';
        }
        success = true;
      } catch (error) {
        console.error(`Attempt ${attempts} failed:`, error);
        if (attempts < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); 
        } else {
          geminiResponse = `ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI หรือ API Key ไม่ถูกต้อง: ${error.message}`;
        }
      }
    }

    setMessages(prev => [
      ...prev,
      { sender: 'ai', text: geminiResponse }
    ]);

    setIsLoading(false);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) sendMessageToGemini(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputMessage.trim() && !isLoading) {
      handleSendMessage();
    }
  };

  const showInitialWelcomeUI = messages.length === 1 && messages[0].sender === 'ai';

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 ${primaryColor} ${primaryHoverColor} text-white p-5 rounded-full shadow-2xl z-50 
                   focus:outline-none focus:ring-4 ${focusRingColor} focus:ring-opacity-50
                   transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-[0_0_30px_rgba(154,21,24,0.5)]`}
      >
        <svg xmlns="http://www.w3.org/2000/svg"
             className={`h-7 w-7 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          )}
        </svg>
      </button>

      {/* Chat Window */}
      {isVisible && (
        <div className={`fixed bottom-24 right-6 z-50 flex flex-col
                        w-[calc(100vw-3rem)] sm:w-96 md:w-[420px] lg:w-[460px]
                        h-[calc(100vh-180px)] sm:h-[500px] md:h-[580px] lg:h-[650px]
                        rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]
                        transition-all duration-300 ease-out origin-bottom-right overflow-hidden
                        ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
             style={{
               background: 'rgba(255, 255, 255, 0.5)',
               backdropFilter: 'blur(20px) saturate(180%)',
               WebkitBackdropFilter: 'blur(20px) saturate(180%)',
               border: '1px solid rgba(255, 255, 255, 0.2)',
             }}>
          
          {/* Header with Gradient */}
          <div className={`p-4 flex justify-between items-center ${primaryColor} relative overflow-hidden flex-none`}
               style={{
                 background: 'linear-gradient(135deg, #9a1518 0%, #c41e22 100%)',
               }}>
            <div className="flex items-center space-x-3 z-10">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">CodMe AI Assistant</h3>
                <p className="text-xs text-white/80">พร้อมให้คำปรึกษาตลอด 24 ชม.</p>
              </div>
            </div>
            <button onClick={toggleChat} className="text-white/90 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-200 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl"></div>
          </div>

          {/* Chat Content */}
          <div ref={chatContentRef} className="flex-grow p-5 overflow-y-auto flex flex-col space-y-4 min-h-0">
            {showInitialWelcomeUI ? (
              <div className="flex flex-col items-center justify-center h-full space-y-6 px-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#9a1518] to-[#c41e22] rounded-3xl flex items-center justify-center shadow-xl rotate-6 hover:rotate-12 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
                </div>
                
                <div className="text-center space-y-3">
                  <h4 className="text-2xl font-bold text-gray-800">ยินดีต้อนรับ! 👋</h4>
                  <p className="text-gray-600 text-base leading-relaxed max-w-xs">
                    ฉันคือผู้ช่วยอัจฉริยะของสาขาวิศวกรรมคอมพิวเตอร์ และ สื่อดิจิตอล<br/>
                    <span className="text-[#9a1518] font-semibold">มหาวิทยาลัยขอนแก่น</span>
                  </p>
                </div>

                <div className="w-full max-w-xs space-y-2">
                  <p className="text-sm text-gray-500 text-center font-medium">คำถามแนะนำ:</p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setInputMessage('วิชาเลือกสำหรับคนที่ชอบเขียนเว็บมีอะไรบ้าง')}
                      className="w-full p-3 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-xl text-sm text-gray-700 text-left transition-all duration-200 border border-gray-200 hover:border-[#9a1518] hover:shadow-md"
                    >
                      💻 วิชาเลือกสำหรับคนที่ชอบเขียนเว็บ
                    </button>
                    <button 
                      onClick={() => setInputMessage('หลักสูตรของคณะมีอะไรบ้าง')}
                      className="w-full p-3 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-xl text-sm text-gray-700 text-left transition-all duration-200 border border-gray-200 hover:border-[#9a1518] hover:shadow-md"
                    >
                      📚 หลักสูตรของคณะมีอะไรบ้าง
                    </button>
                  </div>
                </div>
              </div>
            ) : ( 
              messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-[#9a1518] to-[#c41e22] text-white rounded-br-sm'
                        : 'bg-white/80 backdrop-blur-sm text-gray-800 border border-white/50 rounded-bl-sm'
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: msg.sender === 'ai' ? formatAIResponse(msg.text) : msg.text
                    }}
                  />
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-white/80 backdrop-blur-sm text-gray-800 p-4 rounded-2xl rounded-bl-sm shadow-lg border border-white/50 flex space-x-2">
                  <div className="w-2.5 h-2.5 bg-[#9a1518] rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-[#9a1518] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2.5 h-2.5 bg-[#9a1518] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/30"
               style={{
                 background: 'rgba(255, 255, 255, 0.3)',
                 backdropFilter: 'blur(10px)',
                 WebkitBackdropFilter: 'blur(10px)',
               }}>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="พิมพ์ข้อความของคุณที่นี่..."
                className="flex-grow px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-[#9a1518] focus:border-transparent
                         placeholder-gray-400 text-gray-800 transition-all duration-200"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                className={`${primaryColor} ${primaryHoverColor} text-white p-3 rounded-xl shadow-lg
                          transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                          hover:scale-105 active:scale-95 min-w-[52px] flex items-center justify-center`}
                disabled={isLoading || !inputMessage.trim()}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Custom Scrollbar */
        *::-webkit-scrollbar {
          width: 6px;
        }

        *::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        *::-webkit-scrollbar-thumb {
          background: rgba(154, 21, 24, 0.5);
          border-radius: 10px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: rgba(154, 21, 24, 0.7);
        }
      `}</style>
    </>
  );
};

export default ChatButton;