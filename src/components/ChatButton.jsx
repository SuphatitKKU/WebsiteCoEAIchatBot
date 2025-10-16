import React from 'react';
import { useChatLogic } from './ChatLogic';
import ChatWindowDesktop from './ChatWindowDesktop';
import ChatWindowMobile from './ChatWindowMobile'; // Import the new mobile chat window

const ChatButton = () => {
  const {
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
    showInitialWelcomeUI
  } = useChatLogic(); // Use the custom hook for all chat logic

  // Tailwind CSS theme colors
  const primaryColor = 'bg-[#9a1518]';
  const primaryHoverColor = 'hover:bg-[#7e1214]';
  const focusRingColor = 'focus:ring-[#9a1518]';

  // Common props to pass to both ChatWindow components
  const chatWindowProps = {
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
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'ปิดหน้าต่างแชท' : 'เปิดหน้าต่างแชท'}
        className={`fixed bottom-6 right-6 ${primaryColor} ${primaryHoverColor} text-white p-4 rounded-full shadow-2xl z-50 focus:outline-none focus:ring-4 ${focusRingColor} focus:ring-opacity-50 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-[0_0_30px_rgba(154,21,24,0.5)]`}
      >
        <svg xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
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

      {/* Render Desktop Chat Window (hidden on small screens) */}
      {isVisible && <ChatWindowDesktop {...chatWindowProps} />}

      {/* Render Mobile Chat Window (shown only on small screens) */}
      {isVisible && <ChatWindowMobile {...chatWindowProps} />}

      {/* Styles for animations and custom scrollbar */}
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