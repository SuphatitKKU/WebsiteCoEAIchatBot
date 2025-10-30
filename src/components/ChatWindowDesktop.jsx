import React from 'react';
import MessageBubble from './MessageBubble';
import InitialWelcomeUI from './InitialWelcomeUI';

const ChatWindowDesktop = ({
  isOpen,
  isVisible,
  messages,
  inputMessage,
  isLoading,
  chatContentRef,
  toggleChat,
  setInputMessage,
  handleSendMessage,
  handleKeyPress,
  formatAIResponse,
  showInitialWelcomeUI,
  // Props สำหรับ Pop-up
  showPetitionAlert,
  setShowPetitionAlert
}) => {
  const primaryColor = 'bg-[#9a1518]';
  const primaryHoverColor = 'hover:bg-[#7e1214]';

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-24 right-6 z-50 flex flex-col
                    w-96 md:w-[420px] lg:w-[460px]
                    h-[380px] md:h-[430px] lg:h-[480px] // ขนาดคงที่
                    rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]
                    transition-all duration-300 ease-out origin-bottom-right overflow-hidden
                    ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}
                    hidden sm:flex`} 
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>

      {/* START: CODE FOR POPUP ALERT */}
      {showPetitionAlert && ( 
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60]"> 
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4 border-t-4 border-[#9a1518] transform transition-all duration-300 scale-100 animate-fadeIn">
            <h3 className="text-xl font-extrabold text-[#9a1518] mb-2">🔔 แจ้งเตือน: การยื่นคำร้อง</h3>
            <p className="text-gray-700 text-base">เนื่องจากการดำเนินการต้องใช้เวลา **กรุณาตรวจสอบกำหนดเวลายื่นคำร้องตามที่ท่านประสงค์**</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPetitionAlert(false)} // ปิด Pop-up
                className={`${primaryColor} ${primaryHoverColor} text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg active:scale-95`}
              >
                รับทราบ
              </button>
            </div>
          </div>
        </div>
      )}
      {/* END: CODE FOR POPUP ALERT */}

      {/* Header with Gradient */}
      <div className={`p-3 flex justify-between items-center ${primaryColor} relative overflow-hidden flex-none`}
        style={{
          background: 'linear-gradient(135deg, #9a1518 0%, #c41e22 100%)',
        }}>
        <div className="flex items-center space-x-2 z-10">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">CodMe AI Assistant</h3>
            <p className="text-xs text-white/80">พร้อมให้คำปรึกษาตลอด 24 ชม.</p>
          </div>
        </div>
        <button onClick={toggleChat} aria-label="ปิดหน้าต่างแชท" className="text-white/90 hover:text-white hover:bg-white/10 rounded-full p-1 transition-all duration-200 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8 blur-2xl"></div>
      </div>

      {/* Chat Content Area */}
      <div ref={chatContentRef} className="flex-grow p-3 overflow-y-auto flex flex-col space-y-3 min-h-0 text-sm">
        {showInitialWelcomeUI ? (
          <InitialWelcomeUI setInputMessage={setInputMessage} />
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} sender={msg.sender} text={msg.text} formatAIResponse={formatAIResponse} />
          ))
        )}
        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white/80 backdrop-blur-sm text-gray-800 p-3 rounded-xl rounded-bl-sm shadow-lg border border-white/50 flex space-x-1.5">
              <div className="w-2 h-2 bg-[#9a1518] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#9a1518] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#9a1518] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-white/30 text-sm"
        style={{
          background: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="พิมพ์ข้อความของคุณที่นี่..."
            className="flex-grow px-3 py-2 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-[#9a1518] focus:border-transparent
                     placeholder-gray-400 text-gray-800 transition-all duration-200"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            aria-label="ช่องป้อนข้อความแชท"
          />
          <button
            onClick={handleSendMessage}
            className={`${primaryColor} ${primaryHoverColor} text-white p-2 rounded-lg shadow-lg
                      transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                      hover:scale-105 active:scale-95 min-w-[40px] flex items-center justify-center`}
            disabled={isLoading || !inputMessage.trim()}
            aria-label="ส่งข้อความ"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindowDesktop;