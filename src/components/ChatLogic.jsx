import { useState, useEffect, useRef, useCallback } from "react";

// ✅ Hardcoded API Key (ชั่วคราว - ควรย้ายไปใช้ environment variables ในโปรเจกต์จริง)
const GEMINI_API_KEY = "AIzaSyBprj3OSZ2AI5OQNvzvuLu25UFF1biCLJo";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const useChatLogic = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPetitionAlert, setShowPetitionAlert] = useState(false);
  // Data for course knowledge base
  const [courseCoEData, setCourseCoEData] = useState("");
  const [courseDMEData, setCourseDMEData] = useState("");

  const chatContentRef = useRef(null);
  const hasDisplayedWelcome = useRef(false);
  const hasFetchedData = useRef(false);
  const hasCheckedApiKey = useRef(false); // ✅ เพิ่ม ref สำหรับตรวจสอบ API Key

  // --- Utility Functions ---

  const fetchCourseData = async (path, setData) => {
    try {
      console.log("Fetching course data from:", path);
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} from ${path}`);
      }
      const text = await response.text();
      console.log(`✅ Successfully loaded data from ${path}`);
      setData(text);
    } catch (err) {
      console.error(`❌ Error loading course knowledge from ${path}:`, err);
    }
  };

  const formatAIResponse = useCallback((text) => {
    let formatted = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    const lines = formatted.split("\n");
    let inList = false;
    let result = [];

    for (let line of lines) {
      if (line.trim().startsWith("*") && !line.trim().startsWith("**")) {
        if (!inList) {
          result.push('<ul class="list-disc list-inside space-y-1 mt-2">');
          inList = true;
        }
        const content = line.trim().substring(1).trim();
        result.push(`<li>${content}</li>`);
      } else {
        if (inList) {
          result.push("</ul>");
          inList = false;
        }
        if (line.trim()) {
          result.push(`<p class="mb-2">${line}</p>`);
        }
      }
    }

    if (inList) result.push("</ul>");

    return result.join("");
  }, []);

  // --- Effects ---

  // ✅ ตรวจสอบ API Key เมื่อโหลดครั้งแรก
  useEffect(() => {
    if (!hasCheckedApiKey.current) {
      hasCheckedApiKey.current = true;
      
      console.log("🔍 Checking API Key...");
      console.log("📋 All environment variables:", import.meta.env);
      
      if (!GEMINI_API_KEY) {
        console.error("❌ GEMINI_API_KEY is not defined!");
        console.error("⚠️ Chatbot will not work without API key!");
        console.log("💡 If deploying to GitHub Pages, make sure to:");
        console.log("   1. Add VITE_GEMINI_API_KEY to GitHub Secrets");
        console.log("   2. Update GitHub Actions workflow to inject the secret");
      } else {
        console.log("✅ GEMINI_API_KEY loaded successfully");
        console.log("🔑 API Key length:", GEMINI_API_KEY.length);
        console.log("🔑 API Key preview:", GEMINI_API_KEY.substring(0, 10) + "...");
      }
    }
  }, []);

  // ✅ Fetch course data - รันแค่ครั้งเดียว
  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      const basePath = import.meta.env.BASE_URL;

      fetchCourseData(`${basePath}data/course_coe.txt`, setCourseCoEData);
      fetchCourseData(`${basePath}data/course_dme.txt`, setCourseDMEData);
    }
  }, []);

  // Effect to add initial AI welcome message
  useEffect(() => {
    if (!hasDisplayedWelcome.current) {
      setMessages([
        {
          sender: "ai",
          text: "สวัสดีครับ! ฉันคือผู้ช่วยอัจฉริยะของสาขาวิศวกรรมคอมพิวเตอร์ และ สื่อดิจิตอล มหาวิทยาลัยขอนแก่น พร้อมให้คำปรึกษาเกี่ยวกับหลักสูตรและวิชาเรียนต่างๆ มีอะไรให้ช่วยไหมครับ?",
        },
      ]);
      hasDisplayedWelcome.current = true;
    }
  }, []);

  // Effect to scroll to bottom of chat content
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Chat Logic ---

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setIsVisible(false), 300);
    } else {
      setIsVisible(true);
      setTimeout(() => setIsOpen(true), 10);
    }
  };

  const sendMessageToGemini = useCallback(
    async (text, currentMessages) => {
      if (!text.trim()) return;

      // ✅ ตรวจสอบ API Key ก่อนส่งข้อความ
      if (!GEMINI_API_KEY) {
        console.error("❌ Cannot send message: API Key is not defined");
        setMessages((prev) => [
          ...prev,
          { sender: "user", text },
          { 
            sender: "ai", 
            text: "❌ เกิดข้อผิดพลาด: ไม่พบ API Key ของ Gemini\n\nกรุณาตรวจสอบการตั้งค่า environment variables (VITE_GEMINI_API_KEY)\n\nหากคุณกำลัง deploy บน GitHub Pages ให้ตรวจสอบว่าได้เพิ่ม Secret ใน GitHub Actions แล้ว" 
          }
        ]);
        return;
      }

      const lowerCaseText = text.toLowerCase();

      const PETITION_KEYWORDS = ["ยื่นคำร้อง", "ยื่น คำร้อง", "คำร้อง", "ขอคำร้อง","ลาพักการศึกษา","ลาพัก","ลาถอน","ขอถอน","ขอลาพัก","ยื่นลาพักการศึกษา","ยื่นลาพัก","ยื่นถอน","ถอนทุกวิชา"];
      const isPetitionRelated = PETITION_KEYWORDS.some(keyword => text.includes(keyword));

      if (isPetitionRelated) {
        setShowPetitionAlert(true);
      }
      
      const OVER_CREDIT_KEYWORDS = ["เรียนเกิน", "ลงทะเบียนเกิน", "หน่วยกิตเกิน", "เกิน 22", "เกิน 22 หน่วยกิต", "ลงเกิน"];
      const isOverCreditRelated = OVER_CREDIT_KEYWORDS.some(keyword => lowerCaseText.includes(keyword));

      const REGRADE_KEYWORDS = ["รีเกรด", "regrade", "สามารถรีเกรด", "ขอรีเกรด", "อยากรีเกรด"];
      const isRegradeRelated = REGRADE_KEYWORDS.some(keyword => lowerCaseText.includes(keyword));

      const DROP_KEYWORDS = ["ถอน", "ถอนวิชา"];
      const isDropRelated = DROP_KEYWORDS.some(keyword => lowerCaseText.includes(keyword));
      
      const F_KEYWORDS = ["F", "f","เกรด F", "grade F"];
      const isFRelated = F_KEYWORDS.some(keyword => lowerCaseText.includes(keyword));
      
      const isHonorWithdrawRelated = lowerCaseText.includes("เกียรตินิยม") && lowerCaseText.includes("ถอน");

      const isHonorFRelated = lowerCaseText.includes("เกียรตินิยม") && lowerCaseText.includes("F");

      const PORTFOLIO_KEYWORDS = ["พอร์ท", "พอร์ต","Portfolio", "Port","รอบ 1","รอบ1","รอบแรก"];
      const isPortfolioRelated = PORTFOLIO_KEYWORDS.some(keyword => lowerCaseText.includes(keyword));
      
      const RANDOM_KEYWORDS = ["แรนด้อม", "หลุด","Random"];
      const isRandomRelated = RANDOM_KEYWORDS.some(keyword => lowerCaseText.includes(keyword));

      const RESERVE_KEYWORDS = ["ที่นั่งสำรอง", "สำรอง","Reserve"];
      const isReserveRelated = RESERVE_KEYWORDS.some(keyword => lowerCaseText.includes(keyword));

      setIsLoading(true);
      setMessages((prev) => [...prev, { sender: "user", text }]);
      setInputMessage("");

      const baseSystemInstruction =
        "คุณเป็น AI ผู้ช่วยของสาขาวิศวกรรมคอมพิวเตอร์ และ สื่อดิจิตอล มหาวิทยาลัยขอนแก่น ให้คำแนะนำเกี่ยวกับหลักสูตรและวิชาเรียนต่างๆ";

      const isCourseOrTeacherRelated =
        lowerCaseText.includes("หลักสูตร") ||
        lowerCaseText.includes("วิชา") ||
        lowerCaseText.includes("คณะ") ||
        lowerCaseText.includes("เรียน") ||
        lowerCaseText.includes("สาขา") ||
        lowerCaseText.includes("คอมพิวเตอร์") ||
        lowerCaseText.includes("ดิจิตอล") ||
        lowerCaseText.includes("ภาควิชา") ||
        lowerCaseText.includes("อาจารย์") ||
        lowerCaseText.includes("ผู้สอน") ||
        lowerCaseText.includes("ชื่ออาจารย์") ||
        lowerCaseText.includes("ใครสอน");

      let contextData = "";
      if ((courseCoEData || courseDMEData) && isCourseOrTeacherRelated) {
        contextData = `ข้อมูลหลักสูตรและวิชาเรียน รวมถึงอาจารย์ผู้สอน:
${courseCoEData ? `--- หลักสูตรวิศวกรรมคอมพิวเตอร์ ---\n${courseCoEData}` : ""}
${courseDMEData ? `--- หลักสูตรสื่อดิจิทัล ---\n${courseDMEData}` : ""}
กรุณาตอบคำถามโดยอ้างอิงจากข้อมูลด้านบนเป็นหลัก ถ้าคำถามไม่เกี่ยวข้องกับข้อมูลที่มี ให้ตอบตามความรู้ทั่วไปแต่แจ้งให้ผู้ใช้ทราบว่าข้อมูลนี้ไม่ได้มาจากฐานข้อมูลหลักสูตร`;
      }

      let extraInstruction = '';

      if (isPetitionRelated) {
        extraInstruction += 'คำถามเกี่ยวกับการยื่นคำร้อง: ตอบว่า "คุณสามารถยื่นคำร้องต่างๆ ได้ผ่านเว็บไซต์ https://req.kku.ac.th โดยสามารถดูรายละเอียดวันที่เปิดให้ยื่นคำร้องได้ที่กลุ่มหรือเพจของทางสาขา COE: CoE Students KKU, DME: Digital Media Engineering KKU"\n\n';
        extraInstruction += 'คำถามเกี่ยวกับการลาพักการศึกษา: ตอบว่า "หากคุณต้องการลาพักการศึกษา คุณสามารถยื่นคำร้องได้ผ่านเว็บไซต์ https://req.kku.ac.th ในช่วงเวลาที่มีการเปิดให้ยื่นคำร้อง ในการลาพักไม่นับเป็นระยะเวลาในการศึกษา โดยนักศึกษามีเวลาเรียน 8 ปี ในระหว่างนั้นหากคุณประสบปัญหาใดๆขณะเรียนที่ทำให้ต้องพักการศึกษา คุณสามารถยื่นลาพักได้ โดยการลาพักนั้นจะไม่นับเป็นเวลาการศึกษา"\n\n';
        extraInstruction += 'คำถามเกี่ยวกับการถอนทุกรายวิชา: ตอบว่า "ในการที่จะถอนทุกวิชานั้น คุณจำเป็นต้องยื่นลาพักก่อนครับ ซึ่งการยื่นลาพักจะหมดเขตก่อน ฉะนั้นควรรีบยื่นแต่เนิ่นๆครับ มิฉะนั้นจะมีค่าธรรมเนียมเพิ่มหากยื่นช้า"\n\n';
      }

      if (isOverCreditRelated) {
        extraInstruction += 'คำถามเกี่ยวกับการลงทะเบียนหน่วยกิตเกิน: ตอบว่า "คุณสามารถทำได้นะครับ! แต่ถ้าหากต้องการลงทะเบียนหน่วยกิตเกิน 22 หน่วยกิต จำเป็นต้องติดต่อขอลงทะเบียนมากกว่ากำหนดกับฝ่ายทะเบียนของคณะหรือสาขา เพื่อดำเนินการตามขั้นตอนต่อไป"\n\n';
      }

      if (isRegradeRelated) {
        extraInstruction += 'คำถามเกี่ยวกับการรีเกรด: ตอบว่า "หากต้องการรีเกรด คุณสามารถรีเกรดได้แค่เกรด F, D และ D+ เท่านั้นนะครับ ยกเว้นในกรณีที่เกรดเฉลี่ยรวมไม่เพียงพอในการจบการศึกษา ถึงจะสามารถรีเกรด C ได้ครับ"\n\n';
      }

      if (isDropRelated) {
        extraInstruction += 'คำถามเกี่ยวกับการถอน: ตอบว่า "การถอนรายวิชานั้น ไม่มีผลต่อการคิดเกรดซึ่งจะมีการแสดงผลในทรานสคริปต์ระหว่างเรียน แต่ไม่แสดงผลในทรานสคริปต์เมื่อเรียนจบครับ"\n\n';
      }

      if (isFRelated) {
        extraInstruction += 'คำถามเกี่ยวกับการติดF: ตอบว่า "ในการติด F หากเป็นรายวิชาที่ไม่บังคับ (วิชาเสรีและวิชาภาค) สามารถติดได้นะครับ ถ้าเกรดยังผ่านเกณฑ์จะยังสามารถเรียนจบได้อยู่ แต่ในทางที่ดีควรทำการลงเรียนเพื่อแก้ F เนื่องจากจะขึ้นแสดงในทรานสคริปต์หลังจากเรียนจบ หากทำการแก้ ในทรานสคริปต์จะขึ้นแสดงเฉพาะเกรดที่ดีที่สุดครับ"\n\n';
      }

      if (isHonorFRelated) {
        extraInstruction += 'คำถามเกี่ยวกับเกียรตินิยมหากติดF: ตอบว่า "หากติด F ถือว่าหมดสิทธิ์ในการได้เกียรตินิยมอย่างไม่มีข้อยกเว้นครับ แต่อย่าพึ่งท้อ ลองหาเป้าหมายอื่นๆดูไหมครับ"\n\n';
        extraInstruction += 'คำถามเกี่ยวกับเกียรตินิยมหากติดF: ต้องตอบชัดเจนว่า ติด F ถือว่าหมดสิทธิ์ในการได้เกียรตินิยมอย่างไม่มีข้อยกเว้น สามารถให้กำลังใจได้ แต่ย้ำชัดเจนว่า หมดสิทธิ์ในการได้เกียรตินิยม\n\n';
      }

      if (isHonorWithdrawRelated) {
        extraInstruction += 'คำถามเกี่ยวกับเกียรตินิยมและการถอน: ตอบว่า "การถอนไม่ส่งผลต่อการได้รับเกียรตินิยมครับ ใดๆก็ตามหากต้องการเกียรตินิยมควรระวังเนื่องจากหากติด F จะหมดสิทธิ์ในการได้เกียรตินิยมทันที โดยต่อให้ถอนเพื่อรีเกรดให้สูงขึ้นแต่ในการคำนวณเกรดจะคิดตามเกรดจริงที่ได้ในครั้งแรกครับ"\n\n';
      }

      if (isPortfolioRelated) {
        extraInstruction += 'คำถามเกี่ยวกับการเข้ารอบพอร์ตฟอลิโอ: ตอบว่า "หากคุณต้องการเข้ารอบ Portfolio แนะนำให้ตรวจดูรายละเอียดได้ที่เว็บไซต์ https://kku.world/porten69 พอร์ทที่จะส่งควรถูกต้องและตรงตามระเบียบเกณฑ์ของมหาวิทยาลัย มีประทับตราอย่างชัดเจน"\n\n';
      }

      if (isRandomRelated) {
        extraInstruction += 'คำถามเกี่ยวกับการrandom: ตอบว่า "การลงทะเบียนเรียนแล้วมีการแรนด้อมมาจากการที่วิชาที่คุณลงนั้นเป็นวิชาที่มีจำนวนคนลงสูง หรือคุณเลือกลงในเซคที่มีคนลงเยอะ หรือวิชาเสรีที่มีคนสนใจเป็นจำนวนมาก จึงต้องมีการแรนด้อมเพื่อความเท่าเทียมแก่นักศึกษาครับ"\n\n';
      }

      if (isReserveRelated) {
        extraInstruction += 'คำถามเกี่ยวกับที่นั่งสำรอง: ตอบว่า "ในปกติ แต่ละวิชาจะมีที่นั่งพอสำหรับนักศึกษาในภาคเรียนนั้นๆ การที่รายวิชาดังกล่าวเต็มอาจมาจากการที่คุณต้องการลงเรียนซ้ำและไม่ได้สำรองที่นั่ง คุณสามารถยื่นสำรองที่นั่งได้ผ่านเว็บไซต์ https://req.kku.ac.th โดยต้องเตรียมเอกสารแบบแผนการเรียนที่คุณได้วางไว้ เพื่อประกอบการพิจารณาในการให้สิทธิสำรองที่นั่ง"\n\n';
      }

      const MAX_HISTORY_MESSAGES = 8;
      const historyForAPI = currentMessages
        .filter((msg) => msg.sender === "user" || msg.sender === "ai")
        .slice(Math.max(currentMessages.length - MAX_HISTORY_MESSAGES, 0))
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        }));

      const combinedUserPromptText = `${baseSystemInstruction}
${extraInstruction}${contextData ? `${contextData}\n\n` : ""}คำถาม: ${text}`;

      const contentsToSend = [
        ...historyForAPI,
        { role: "user", parts: [{ text: combinedUserPromptText }] },
      ];

      const MAX_RETRIES = 3;
      let attempts = 0;
      let success = false;
      let geminiResponse =
        "ขออภัย ไม่ได้รับคำตอบจาก AI หรือเกิดข้อผิดพลาดในการเชื่อมต่อ";

      while (attempts < MAX_RETRIES && !success) {
        attempts++;
        try {
          console.log(`🔄 Attempt ${attempts} - Sending request to Gemini API...`);
          
          const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-goog-api-key": GEMINI_API_KEY,
            },
            body: JSON.stringify({
              contents: contentsToSend,
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
                {
                  category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
                {
                  category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
              ],
            }),
          });

          console.log(`📡 Response status: ${response.status}`);

          if (!response.ok) {
            if (response.status === 429 || response.status >= 500) {
              console.warn(
                `Attempt ${attempts} failed with status ${response.status}. Retrying...`
              );
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * attempts)
              );
              continue;
            }
            const errorText = await response.text();
            console.error(`API error response:`, errorText);
            throw new Error(
              `API error ${response.status}: ${errorText}`
            );
          }

          const data = await response.json();
          console.log("✅ Received response from Gemini API");

          if (data.promptFeedback && data.promptFeedback.blockReason) {
            geminiResponse = `ข้อความของคุณถูกบล็อกโดยระบบความปลอดภัยของ AI: ${data.promptFeedback.blockReason}`;
          } else if (data.candidates?.[0]?.finishReason === "SAFETY") {
            geminiResponse = "ขออภัย คำตอบของ AI ถูกบล็อกโดยระบบความปลอดภัย";
          } else {
            geminiResponse =
              data.candidates?.[0]?.content?.parts?.[0]?.text ||
              "ไม่ได้รับคำตอบจาก AI ที่ถูกต้อง";
          }
          success = true;
        } catch (error) {
          console.error(`❌ Attempt ${attempts} failed:`, error);
          if (attempts === MAX_RETRIES) {
            let errorMsg = `ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI`;
            
            if (error.message.includes('API key')) {
              errorMsg += '\n\n🔑 ปัญหา: API Key ไม่ถูกต้อง\nกรุณาตรวจสอบว่า API Key ถูกต้องและยังใช้งานได้';
            } else if (error.message.includes('Failed to fetch')) {
              errorMsg += '\n\n🌐 ปัญหา: ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้\nกรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
            } else if (error.message.includes('400')) {
              errorMsg += '\n\n⚠️ ปัญหา: คำขอไม่ถูกต้อง\nอาจเป็นเพราะ API Key หมดอายุหรือไม่ถูกต้อง';
            } else {
              errorMsg += `\n\n📋 รายละเอียด: ${error.message}`;
            }
            
            geminiResponse = errorMsg;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
        }
      }

      setMessages((prev) => [...prev, { sender: "ai", text: geminiResponse }]);
      setIsLoading(false);
    },
    [courseCoEData, courseDMEData]
  );

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isLoading) {
      sendMessageToGemini(inputMessage, messages);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const showInitialWelcomeUI =
    messages.length === 1 && messages[0].sender === "ai";

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
    setMessages,
    showPetitionAlert,
    setShowPetitionAlert
  };
};