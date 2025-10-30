import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, ArrowRight } from 'lucide-react';

// Mock data สำหรับข่าวสาร
const NEWS_DATA = [
  {
    id: 1,
    title: 'คณะวิศวกรรมศาสตร์ มข. จัดงาน Open House 2025',
    excerpt: 'เปิดบ้านคณะวิศวกรรมศาสตร์ พบกับกิจกรรมสุดพิเศษ ชมห้องปฏิบัติการ และพบกับพี่ๆ นักศึกษา',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=500&fit=crop',
    date: '25 ตุลาคม 2025',
    author: 'ฝ่ายประชาสัมพันธ์',
    category: 'กิจกรรม',
    fullContent: 'คณะวิศวกรรมศาสตร์ มหาวิทยาลัยขอนแก่น ขอเชิญน้องๆ นักเรียนที่สนใจเข้าศึกษาต่อในสาขาวิศวกรรมคอมพิวเตอร์และวิศวกรรมสื่อดิจิทัล เข้าร่วมงาน Open House 2025 พบกับกิจกรรมสุดพิเศษมากมาย ชมห้องปฏิบัติการทางด้านเทคโนโลยีล่าสุด พูดคุยกับพี่ๆ นักศึกษาและอาจารย์ผู้เชี่ยวชาญ รับข้อมูลหลักสูตรการเรียนการสอน และโอกาสในการทำงาน'
  },
  {
    id: 2,
    title: 'นักศึกษาสาขาวิศวกรรมคอมพิวเตอร์คว้ารางวัลชนะเลิศการแข่งขัน Hackathon',
    excerpt: 'ยินดีกับทีมนักศึกษาชั้นปีที่ 3 ที่คว้ารางวัลชนะเลิศจากการแข่งขัน National Hackathon 2025',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop',
    date: '18 ตุลาคม 2025',
    author: 'คณะวิศวกรรมศาสตร์',
    category: 'ความสำเร็จ',
    fullContent: 'ทีมนักศึกษาจากสาขาวิศวกรรมคอมพิวเตอร์ ชั้นปีที่ 3 ได้รับรางวัลชนะเลิศการแข่งขัน National Hackathon 2025 ด้วยโปรเจค "Smart Agriculture Platform" ระบบเกษตรอัจฉริยะที่ช่วยเพิ่มผลผลิตและลดต้นทุนการผลิตให้กับเกษตรกร โดยใช้เทคโนโลยี IoT, AI และ Machine Learning'
  },
  {
    id: 3,
    title: 'เปิดรับสมัครนักศึกษาใหม่ ปีการศึกษา 2568',
    excerpt: 'คณะวิศวกรรมศาสตร์ มข. เปิดรับสมัครนักศึกษาใหม่ 2 สาขา วิศวกรรมคอมพิวเตอร์ และวิศวกรรมสื่อดิจิทัล',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=500&fit=crop',
    date: '10 ตุลาคม 2025',
    author: 'งานรับเข้า',
    category: 'ประกาศ',
    fullContent: 'คณะวิศวกรรมศาสตร์ มหาวิทยาลัยขอนแก่น เปิดรับสมัครนักศึกษาใหม่ประจำปีการศึกษา 2568 สำหรับหลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมคอมพิวเตอร์ และสาขาวิศวกรรมสื่อดิจิทัล พร้อมทุนการศึกษาสำหรับนักเรียนที่มีผลการเรียนดี สามารถสมัครผ่านระบบ TCAS ได้ตั้งแต่เดือนพฤศจิกายน 2568'
  },
  {
    id: 4,
    title: 'อบรมเชิงปฏิบัติการ "AI และ Machine Learning สำหรับผู้เริ่มต้น"',
    excerpt: 'คณะจัดอบรมเชิงปฏิบัติการด้าน AI และ ML ให้กับนักศึกษาและผู้สนใจทั่วไป',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop',
    date: '5 ตุลาคม 2025',
    author: 'ฝ่ายวิชาการ',
    category: 'อบรม',
    fullContent: 'คณะวิศวกรรมศาสตร์ จัดอบรมเชิงปฏิบัติการ "AI และ Machine Learning สำหรับผู้เริ่มต้น" เป็นเวลา 2 วัน สอนโดยอาจารย์ผู้เชี่ยวชาญและวิทยากรจากบริษัทชั้นนำ ครอบคลุมตั้งแต่พื้นฐาน Python, การประมวลผลข้อมูล, การสร้างโมเดล ML ไปจนถึงการนำไปใช้งานจริง'
  },
  {
    id: 5,
    title: 'ความร่วมมือกับบริษัทเทคโนโลยีชั้นนำ',
    excerpt: 'คณะลงนามบันทึกข้อตกลงความร่วมมือกับบริษัทเทคโนโลยีชั้นนำ 5 บริษัท เพื่อพัฒนาหลักสูตร',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=500&fit=crop',
    date: '28 กันยายน 2025',
    author: 'คณะวิศวกรรมศาสตร์',
    category: 'ความร่วมมือ',
    fullContent: 'คณะวิศวกรรมศาสตร์ลงนามบันทึกข้อตกลงความร่วมมือทางวิชาการกับบริษัทเทคโนโลยีชั้นนำ 5 บริษัท เพื่อพัฒนาหลักสูตรให้ทันสมัย จัดฝึกงาน Co-op Education และเปิดโอกาสให้นักศึกษาได้เรียนรู้เทคโนโลยีล่าสุดจากผู้เชี่ยวชาญในอุตสาหกรรม'
  },
  {
    id: 6,
    title: 'งานสัมมนาวิชาการ "Future of Technology 2025"',
    excerpt: 'ร่วมฟังการบรรยายจากผู้เชี่ยวชาญด้านเทคโนโลยีชั้นนำ พูดคุยเกี่ยวกับอนาคตของเทคโนโลยี',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
    date: '20 กันยายน 2025',
    author: 'ฝ่ายวิจัย',
    category: 'สัมมนา',
    fullContent: 'คณะวิศวกรรมศาสตร์จัดงานสัมมนาวิชาการ "Future of Technology 2025" เชิญผู้เชี่ยวชาญระดับโลกมาบรรยายเกี่ยวกับแนวโน้มเทคโนโลยี AI, Blockchain, Quantum Computing, และ Metaverse พร้อมเสวนาแลกเปลี่ยนความคิดเห็นระหว่างนักวิชาการและผู้ประกอบการ'
  },
  {
    id: 7,
    title: 'ทีมนักศึกษาได้รับทุนวิจัยจากหน่วยงานภาครัฐ',
    excerpt: 'โครงการวิจัย "Smart City Solutions" ของนักศึกษาได้รับทุนสนับสนุน 500,000 บาท',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop',
    date: '15 กันยายน 2025',
    author: 'ศูนย์วิจัย',
    category: 'ทุนวิจัย',
    fullContent: 'ทีมนักศึกษาสาขาวิศวกรรมคอมพิวเตอร์และวิศวกรรมสื่อดิจิทัลได้รับทุนวิจัยจากสำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ (สวทช.) จำนวน 500,000 บาท สำหรับโครงการ "Smart City Solutions" ที่มุ่งพัฒนาระบบเมืองอัจฉริยะเพื่อแก้ปัญหาการจราจรและมลพิษ'
  },
  {
    id: 8,
    title: 'กิจกรรม "Code for Good" - เขียนโค้ดเพื่อสังคม',
    excerpt: 'นักศึกษาร่วมพัฒนาแอปพลิเคชันเพื่อช่วยเหลือชุมชนและองค์กรการกุศล',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
    date: '8 กันยายน 2025',
    author: 'ชมรมนักศึกษา',
    category: 'กิจกรรมอาสา',
    fullContent: 'กิจกรรม "Code for Good" จัดขึ้นเพื่อให้นักศึกษาได้ใช้ทักษะการเขียนโปรแกรมช่วยเหลือสังคม โดยพัฒนาแอปพลิเคชันและเว็บไซต์ให้กับองค์กรการกุศล โรงเรียนในพื้นที่ห่างไกล และชุมชนที่ขาดแคลนเทคโนโลยี มีนักศึกษาเข้าร่วม 100 คน พัฒนาระบบ 15 โปรเจค'
  }
];

const ITEMS_PER_PAGE = 6;

const Activity = () => {
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(NEWS_DATA.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNews = NEWS_DATA.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'กิจกรรม': 'bg-blue-100 text-blue-700',
      'ความสำเร็จ': 'bg-green-100 text-green-700',
      'ประกาศ': 'bg-red-100 text-red-700',
      'อบรม': 'bg-purple-100 text-purple-700',
      'ความร่วมมือ': 'bg-yellow-100 text-yellow-700',
      'สัมมนา': 'bg-indigo-100 text-indigo-700',
      'ทุนวิจัย': 'bg-pink-100 text-pink-700',
      'กิจกรรมอาสา': 'bg-teal-100 text-teal-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (selectedNews) {
    return (
      <main style={{ position: 'relative', minHeight: '100vh', paddingBottom: '170px', overflow: 'hidden' }}>
        {/* Background images - ปรับให้ responsive */}
        <div 
          style={{ 
            position: 'absolute',
            width: 'min(700px, 80vw)',
            height: 'min(700px, 80vw)',
            top: 'clamp(-180px, -10vw, -80px)', 
            right: 'clamp(10px, 2vw, 50px)',
            opacity: 0.7,
            pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)',
            zIndex: 0
          }}
        />
        
        <div 
          style={{ 
            position: 'absolute',
            width: 'min(700px, 80vw)',
            height: 'min(700px, 80vw)',
            bottom: 'clamp(50px, 10vw, 100px)', 
            left: 'clamp(10px, 2vw, 50px)',
            opacity: 0.7,
            pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(125, 19, 21, 0.15) 0%, transparent 70%)',
            zIndex: 0
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto', padding: 'clamp(1rem, 4vw, 2rem)' }}>
          <button
            onClick={() => setSelectedNews(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
              marginBottom: 'clamp(1rem, 3vw, 2rem)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(0,0,0,0.1)',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(-4px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <ChevronLeft size={20} />
            <span>กลับไปหน้าข่าว</span>
          </button>

          <article style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'clamp(16px, 3vw, 24px)',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            <img 
              src={selectedNews.image} 
              alt={selectedNews.title}
              style={{
                width: '100%',
                height: 'clamp(250px, 40vw, 400px)',
                objectFit: 'cover'
              }}
            />
            
            <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'clamp(0.5rem, 2vw, 1rem)',
                marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
                flexWrap: 'wrap'
              }}>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(selectedNews.category)}`}>
                  {selectedNews.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>
                  <Calendar size={16} />
                  <span>{selectedNews.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>
                  <User size={16} />
                  <span>{selectedNews.author}</span>
                </div>
              </div>

              <h1 style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#1a1a1a',
                lineHeight: '1.3'
              }}>
                {selectedNews.title}
              </h1>

              <div style={{
                width: 'clamp(60px, 10vw, 80px)',
                height: '4px',
                background: 'linear-gradient(to right, #dc2626, #7d1315)',
                marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
                borderRadius: '2px'
              }}></div>

              <p style={{ 
                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                lineHeight: '1.8',
                color: '#333',
                whiteSpace: 'pre-line'
              }}>
                {selectedNews.fullContent}
              </p>
            </div>
          </article>
        </div>
      </main>
    );
  }

  return (
    <main style={{ position: 'relative', minHeight: '100vh', paddingBottom: '170px', overflow: 'hidden' }}>
      {/* Background images - ปรับให้ responsive */}
      <div 
        style={{ 
          position: 'absolute',
          width: 'min(700px, 80vw)',
          height: 'min(700px, 80vw)',
          top: 'clamp(-180px, -10vw, -80px)', 
          right: 'clamp(10px, 2vw, 50px)',
          opacity: 0.7,
          pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)',
          zIndex: 0
        }}
      />
      
      <div 
        style={{ 
          position: 'absolute',
          width: 'min(700px, 80vw)',
          height: 'min(700px, 80vw)',
          bottom: 'clamp(50px, 10vw, 100px)', 
          left: 'clamp(10px, 2vw, 50px)',
          opacity: 0.7,
          pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(125, 19, 21, 0.15) 0%, transparent 70%)',
          zIndex: 0
        }}
      />

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: 'clamp(1rem, 4vw, 2rem)' }}>
        
        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
          <h1 style={{ 
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem',
            color: '#1a1a1a'
          }}>
            ข่าวสารและกิจกรรม
          </h1>
          <div style={{
            width: 'clamp(60px, 10vw, 80px)',
            height: '4px',
            background: 'linear-gradient(to right, #dc2626, #7d1315)',
            margin: '1rem auto',
            borderRadius: '2px'
          }}></div>
          <p style={{ color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
            ติดตามข่าวสารและกิจกรรมของคณะวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น
          </p>
        </div>

        {/* News Grid - ปรับให้ responsive */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(350px, 100%), 1fr))',
          gap: 'clamp(1rem, 3vw, 2rem)',
          marginBottom: 'clamp(2rem, 4vw, 3rem)'
        }}>
          {currentNews.map((news) => (
            <article 
              key={news.id}
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: 'clamp(16px, 3vw, 24px)',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={news.image}
                  alt={news.title}
                  style={{
                    width: '100%',
                    height: 'clamp(180px, 30vw, 200px)',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem'
                }}>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(news.category)}`}>
                    {news.category}
                  </span>
                </div>
              </div>

              <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'clamp(0.5rem, 2vw, 1rem)',
                  marginBottom: '1rem',
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  color: '#666',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} />
                    <span>{news.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <User size={14} />
                    <span>{news.author}</span>
                  </div>
                </div>

                <h3 style={{ 
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', 
                  fontWeight: 'bold',
                  marginBottom: '0.75rem',
                  color: '#1a1a1a',
                  lineHeight: '1.4'
                }}>
                  {news.title}
                </h3>

                <p style={{ 
                  color: '#666',
                  lineHeight: '1.6',
                  marginBottom: '1rem',
                  fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)'
                }}>
                  {news.excerpt}
                </p>

                <button
                  onClick={() => setSelectedNews(news)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: 'clamp(0.5rem, 1.5vw, 0.625rem) clamp(1rem, 2.5vw, 1.25rem)',
                    background: 'linear-gradient(135deg, #dc2626 0%, #7d1315 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateX(4px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateX(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                  }}
                >
                  <span>อ่านเพิ่มเติม</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination - ปรับให้ responsive */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(0.5rem, 2vw, 1rem)',
          marginTop: 'clamp(2rem, 4vw, 3rem)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 2.5vw, 1.5rem)',
              background: currentPage === 1 ? 'rgba(200, 200, 200, 0.5)' : 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(0,0,0,0.1)',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.target.style.transform = 'translateX(-4px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.target.style.transform = 'translateX(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <ChevronLeft size={20} />
            <span>ก่อนหน้า</span>
          </button>

          <div style={{
            display: 'flex',
            gap: 'clamp(0.25rem, 1vw, 0.5rem)',
            alignItems: 'center'
          }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  width: 'clamp(32px, 8vw, 40px)',
                  height: 'clamp(32px, 8vw, 40px)',
                  borderRadius: '8px',
                  border: currentPage === page ? 'none' : '2px solid rgba(0,0,0,0.1)',
                  background: currentPage === page 
                    ? 'linear-gradient(135deg, #dc2626 0%, #7d1315 100%)'
                    : 'rgba(255, 255, 255, 0.9)',
                  color: currentPage === page ? 'white' : '#333',
                  fontWeight: '600',
                  fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: currentPage === page 
                    ? '0 4px 12px rgba(220, 38, 38, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 2.5vw, 1.5rem)',
              background: currentPage === totalPages ? 'rgba(200, 200, 200, 0.5)' : 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(0,0,0,0.1)',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.transform = 'translateX(4px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.transform = 'translateX(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <span>ถัดไป</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Activity;