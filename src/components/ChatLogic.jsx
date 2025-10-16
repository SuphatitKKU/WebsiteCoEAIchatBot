import { useState, useEffect, useRef, useCallback } from 'react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const useChatLogic = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Controls actual DOM rendering for animation
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Data for course knowledge base
  const [courseCoEData, setCourseCoEData] = useState('');
  const [courseDMEData, setCourseDMEData] = useState('');

  // Ref for scrolling chat content (can be passed to UI)
  const chatContentRef = useRef(null);

  // --- Utility Functions ---

  // Fetches course data from text files
  const fetchCourseData = useCallback(async (path, setData) => {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      setData(text);
    } catch (err) {
      console.error(`Error loading course knowledge from ${path}:`, err);
    }
  }, []);

  // Formats AI response with basic Markdown-like syntax
  const formatAIResponse = useCallback((text) => {
    let formatted = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); // Bold text
    const lines = formatted.split('\n');
    let inList = false;
    let result = [];

    for (let line of lines) {
      if (line.trim().startsWith('*') && !line.trim().startsWith('**')) { // Unordered list items
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
          result.push(`<p class="mb-2">${line}</p>`); // Paragraphs
        }
      }
    }

    if (inList) result.push('</ul>'); // Close list if still open

    return result.join('');
  }, []);

  // --- Effects ---

  // Effect to fetch course data on component mount
  useEffect(() => {
    fetchCourseData('/WebsiteCoEAIchatBot/data/course_coe.txt', setCourseCoEData);
    fetchCourseData('/WebsiteCoEAIchatBot/data/course_dme.txt', setCourseDMEData);
  }, [fetchCourseData]);

  // Effect to add initial AI welcome message once
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: 'ai',
          text: 'สวัสดีครับ! ฉันคือผู้ช่วยอัจฉริยะของสาขาวิศวกรรมคอมพิวเตอร์ และ สื่อดิจิตอล มหาวิทยาลัยขอนแก่น พร้อมให้คำปรึกษาเกี่ยวกับหลักสูตรและวิชาเรียนต่างๆ มีอะไรให้ช่วยไหมครับ?'
        }
      ]);
    }
  }, [messages.length]);

  // Effect to scroll to bottom of chat content when messages update
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Chat Logic ---

  // Toggles chat window visibility with animation
  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setIsVisible(false), 300); // Hide after animation
    } else {
      setIsVisible(true);
      setTimeout(() => setIsOpen(true), 10); // Show immediately, then animate open
    }
  };

  // Sends message to Gemini API
  const sendMessageToGemini = useCallback(async (text) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputMessage('');

    const baseSystemInstruction = 'คุณเป็น AI ผู้ช่วยของสาขาวิศวกรรมคอมพิวเตอร์ และ สื่อดิจิตอล มหาวิทยาลัยขอนแก่น ให้คำแนะนำเกี่ยวกับหลักสูตรและวิชาเรียนต่างๆ';

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
    if ((courseCoEData || courseDMEData) && isCourseOrTeacherRelated) {
      contextData = `ข้อมูลหลักสูตรและวิชาเรียน รวมถึงอาจารย์ผู้สอน:
${courseCoEData ? `--- หลักสูตรวิศวกรรมคอมพิวเตอร์ ---\n${courseCoEData}` : ''}
${courseDMEData ? `--- หลักสูตรสื่อดิจิตอล ---\n${courseDMEData}` : ''}
กรุณาตอบคำถามโดยอ้างอิงจากข้อมูลด้านบนเป็นหลัก ถ้าคำถามไม่เกี่ยวข้องกับข้อมูลที่มี ให้ตอบตามความรู้ทั่วไปแต่แจ้งให้ผู้ใช้ทราบว่าข้อมูลนี้ไม่ได้มาจากฐานข้อมูลหลักสูตร`;
    }

    const MAX_HISTORY_MESSAGES = 8;
    const historyForAPI = messages
      .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
      .slice(Math.max(messages.length - MAX_HISTORY_MESSAGES, 0))
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    const combinedUserPromptText = `${baseSystemInstruction}
${contextData ? `${contextData}\n\n` : ''}คำถาม: ${text}`;

    const contentsToSend = [...historyForAPI, { role: 'user', parts: [{ text: combinedUserPromptText }] }];

    const MAX_RETRIES = 3;
    let attempts = 0;
    let success = false;
    let geminiResponse = 'ขออภัย ไม่ได้รับคำตอบจาก AI หรือเกิดข้อผิดพลาดในการเชื่อมต่อ';

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
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
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
          geminiResponse = 'ขออภัย คำตอบของ AI ถูกบล็อกโดยระบบความปลอดภัย';
        } else {
          geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'ไม่ได้รับคำตอบจาก AI ที่ถูกต้อง';
        }
        success = true; // Mark as success to exit loop
      } catch (error) {
        console.error(`Attempt ${attempts} failed:`, error);
        if (attempts === MAX_RETRIES) { // Only update message on final failure
          geminiResponse = `ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI หรือ API Key ไม่ถูกต้อง: ${error.message}`;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Wait before retry
      }
    }

    setMessages(prev => [...prev, { sender: 'ai', text: geminiResponse }]);
    setIsLoading(false);
  }, [courseCoEData, courseDMEData, messages, GEMINI_API_KEY, GEMINI_API_URL]);

  // Handler for sending message
  const handleSendMessage = () => {
    if (inputMessage.trim() && !isLoading) {
      sendMessageToGemini(inputMessage);
    }
  };

  // Handler for Enter key press in input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission behavior
      handleSendMessage();
    }
  };

  const showInitialWelcomeUI = messages.length === 1 && messages[0].sender === 'ai';

  return {
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
    setMessages // Expose setMessages for welcome UI actions, if needed by a child
  };
};