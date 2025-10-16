import React from 'react';

const MessageBubble = ({ sender, text, formatAIResponse }) => {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      <div
        className={`max-w-[80%] p-2 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl text-sm ${
          sender === 'user'
            ? 'bg-gradient-to-br from-[#9a1518] to-[#c41e22] text-white rounded-br-sm'
            : 'bg-white/80 backdrop-blur-sm text-gray-800 border border-white/50 rounded-bl-sm'
        }`}
        // Using dangerouslySetInnerHTML is generally safe here as AI output is processed/formatted
        dangerouslySetInnerHTML={{
          __html: sender === 'ai' ? formatAIResponse(text) : text
        }}
      />
    </div>
  );
};

export default MessageBubble;