import React, { useState, useEffect } from 'react';
import assets from '../assets/assets';

const COURSES = [
  {
    id: 'com',
    title: 'วิศวกรรมคอมพิวเตอร์',
    engTitle: 'Computer Engineering',
    file: '/codme/course/มคอ2-COM-65.pdf', 
    code: 'COM',
    year: '2565'
  },
  {
    id: 'dme',
    title: 'วิศวกรรมสื่อดิจิทัล',
    engTitle: 'Digital Media Engineering',
    file: '/codme/course/มคอ2-DME-65.pdf', 
    code: 'DME',
    year: '2565'
  }
];

const Course = () => {
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false); // สถานะเพื่อตรวจสอบว่าเป็นมือถือหรือไม่

  useEffect(() => {
    // ตรวจสอบขนาดหน้าจอเมื่อ component mount และเมื่อขนาดหน้าจอเปลี่ยน
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // กำหนด breakpoint ที่ 768px สำหรับมือถือ
    };

    checkIsMobile(); // ตรวจสอบครั้งแรก
    window.addEventListener('resize', checkIsMobile); // เพิ่ม event listener เมื่อ resize

    return () => {
      window.removeEventListener('resize', checkIsMobile); // ลบ event listener เมื่อ unmount
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
  }, [selectedCourse]);

  const handleCourseChange = (course) => {
    if (course.id !== selectedCourse.id) {
      setSelectedCourse(course);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    console.error("Failed to load PDF in iframe or PDF is not displayable.");
    setIsLoading(false);
  };

  const getPdfViewerUrl = (pdfPath) => {
    // ใช้ path โดยตรง แต่เพิ่ม parameter เพื่อบังคับให้แสดงแทนดาวน์โหลด
    return `${pdfPath}#view=FitH`;
  };

  return (
    <main style={{ position: 'relative', minHeight: '100vh', paddingBottom: '170px'}}>
      {/* Background images */}
      <img 
        src={assets.bgImage1}
        alt="" 
        style={{ 
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0.7,
          width: '700px',
          height: '700px',
          top: '-180px', 
          right: '10px',
          zIndex: 0
        }}
      />

      <img 
        src={assets.bgImage1}
        alt="" 
        style={{ 
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0.7,
          width: '700px',
          height: '700px',
          top: '700px', 
          left: '10px',
          zIndex: 0
        }}
      />
      
      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem',
            color: '#1a1a1a'
          }}>
            ข้อมูลหลักสูตร
          </h1>
          <div style={{
            width: '80px',
            height: '4px',
            background: 'linear-gradient(to right, #dc2626, #7d1315)',
            margin: '1rem auto',
            borderRadius: '2px'
          }}></div>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            รายละเอียดหลักสูตรและเอกสาร มคอ.2
          </p>
        </div>

        {/* Course Selection Pills */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {COURSES.map((course) => (
            <button
              key={course.id}
              onClick={() => handleCourseChange(course)}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '50px',
                border: selectedCourse.id === course.id ? '3px solid #dc2626' : '2px solid rgba(0,0,0,0.1)',
                background: selectedCourse.id === course.id ? '#dc2626' : 'rgba(255,255,255,0.9)',
                color: selectedCourse.id === course.id ? 'white' : '#333',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedCourse.id === course.id ? '0 4px 12px rgba(220, 38, 38, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                if (selectedCourse.id !== course.id) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCourse.id !== course.id) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }
              }}
            >
              {course.title}
            </button>
          ))}
        </div>

        {/* Main Card */}
        <section style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          marginBottom: '2rem'
        }}>
          
          {/* Card Header with Logo */}
          <header style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.5rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '2px solid rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #dc2626 0%, #7d1315 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '2.5rem' }}>📚</span>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ 
                fontSize: '1.75rem', 
                fontWeight: 'bold',
                marginBottom: '0.25rem',
                color: '#1a1a1a'
              }}>
                {selectedCourse.title}
              </h2>
              <div style={{
                width: '60px',
                height: '3px',
                background: 'linear-gradient(to right, #dc2626, #7d1315)',
                marginBottom: '0.5rem',
                borderRadius: '2px'
              }}></div>
              <p style={{ color: '#666', fontSize: '1rem' }}>
                {selectedCourse.engTitle}
              </p>
            </div>
          </header>

          {/* Document Info Section */}
          <div style={{
            background: 'rgba(220, 38, 38, 0.05)',
            padding: '1.5rem',
            borderRadius: '16px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(220, 38, 38, 0.1)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <div style={{ 
                  color: '#666', 
                  fontSize: '0.875rem', 
                  marginBottom: '0.25rem',
                  fontWeight: '500'
                }}>
                  รหัสหลักสูตร
                </div>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 'bold',
                  color: '#1a1a1a'
                }}>
                  {selectedCourse.code}
                </div>
              </div>
              <div>
                <div style={{ 
                  color: '#666', 
                  fontSize: '0.875rem', 
                  marginBottom: '0.25rem',
                  fontWeight: '500'
                }}>
                  ปีหลักสูตร
                </div>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 'bold',
                  color: '#1a1a1a'
                }}>
                  พ.ศ. {selectedCourse.year}
                </div>
              </div>
              <div>
                <div style={{ 
                  color: '#666', 
                  fontSize: '0.875rem', 
                  marginBottom: '0.25rem',
                  fontWeight: '500'
                }}>
                  ประเภทเอกสาร
                </div>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 'bold',
                  color: '#1a1a1a'
                }}>
                  มคอ.2
                </div>
              </div>
              <div>
                <div style={{ 
                  color: '#666', 
                  fontSize: '0.875rem', 
                  marginBottom: '0.25rem',
                  fontWeight: '500'
                }}>
                  คณะ
                </div>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 'bold',
                  color: '#1a1a1a'
                }}>
                  วิศวกรรมศาสตร์
                </div>
              </div>
            </div>
          </div>

          {/* PDF Viewer Container - Conditional rendering for mobile */}
          <div style={{ position: 'relative', minHeight: isMobile ? 'auto' : '800px' }}>
            {isMobile ? (
              // แสดงเฉพาะปุ่มบนมือถือ
              <div style={{
                padding: '3rem',
                textAlign: 'center',
                background: '#f8f9fa',
                borderRadius: '12px',
                border: '2px solid rgba(0,0,0,0.1)'
              }}>
                <p style={{ 
                  color: '#666', 
                  marginBottom: '1.5rem',
                  fontSize: '1.1rem'
                }}>
                  บนอุปกรณ์มือถือ ขอแนะนำให้เปิดเอกสารในแอปพลิเคชันภายนอกเพื่อประสบการณ์ที่ดีที่สุด
                </p>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', // Stack buttons on mobile
                  gap: '1rem', 
                  maxWidth: '300px', // Limit width for buttons
                  margin: '0 auto' 
                }}>
                  <a
                    href={selectedCourse.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.875rem 2rem',
                      background: 'linear-gradient(135deg, #dc2626 0%, #7d1315 100%)',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span>🔗</span>
                    <span>เปิดเอกสาร</span>
                  </a>
                  <a
                    href={selectedCourse.file}
                    download
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.875rem 2rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: '#333',
                      border: '2px solid rgba(0,0,0,0.1)',
                      borderRadius: '12px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span>⬇</span>
                    <span>ดาวน์โหลดเอกสาร</span>
                  </a>
                </div>
              </div>
            ) : (
              // แสดง iframe บน desktop/tablet
              <>
                {isLoading && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      border: '4px solid rgba(220, 38, 38, 0.2)',
                      borderTop: '4px solid #dc2626',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 1rem'
                    }}></div>
                    <p style={{ color: '#666', fontWeight: '500' }}>กำลังโหลดเอกสาร...</p>
                  </div>
                )}

                <div style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid rgba(0,0,0,0.1)',
                  background: '#f8f9fa',
                  visibility: isLoading ? 'hidden' : 'visible', 
                  height: isLoading ? '0' : '800px', 
                  transition: 'visibility 0s, height 0s, opacity 0.3s ease-in-out',
                  opacity: isLoading ? 0 : 1
                }}>
                  <iframe
                    key={selectedCourse.id} 
                    src={getPdfViewerUrl(selectedCourse.file)}
                    title={`Course Document for ${selectedCourse.title}`}
                    width="100%"
                    height="100%" 
                    style={{
                      border: 'none',
                      display: 'block'
                    }}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    allow="fullscreen"
                  >
                    {/* Fallback content for browsers that don't support iframes or PDF viewing */}
                    <div style={{
                      padding: '3rem',
                      textAlign: 'center',
                      background: '#f8f9fa'
                    }}>
                      <p style={{ 
                        color: '#666', 
                        marginBottom: '1rem',
                        fontSize: '1.1rem'
                      }}>
                        เบราว์เซอร์ของคุณไม่รองรับการแสดง PDF โดยตรง หรือเกิดข้อผิดพลาดในการโหลด
                      </p>
                      <a
                        href={selectedCourse.file}
                        download
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.875rem 2rem',
                          background: 'linear-gradient(135deg, #dc2626 0%, #7d1315 100%)',
                          color: 'white',
                          borderRadius: '12px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                        }}
                      >
                        <span>⬇</span>
                        <span>ดาวน์โหลดเอกสาร PDF</span>
                      </a>
                    </div>
                  </iframe>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons - Removed for redundancy on mobile */}
          {!isMobile && (
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <a
                href={selectedCourse.file}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 2rem',
                  background: 'linear-gradient(135deg, #dc2626 0%, #7d1315 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
                }}
              >
                <span>🔗</span>
                <span>เปิดในหน้าต่างใหม่</span>
              </a>
              <a
                href={selectedCourse.file}
                download
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 2rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#333',
                  border: '2px solid rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
              >
                <span>⬇</span>
                <span>ดาวน์โหลดเอกสาร</span>
              </a>
            </div>
          )}
        </section>

        {/* Info Note */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          textAlign: 'center'
        }}>
          <p style={{ color: '#666', margin: 0, lineHeight: '1.6' }}>
            <strong style={{ color: '#1a1a1a' }}>หมายเหตุ:</strong> เอกสาร มคอ.2 เป็นรายละเอียดหลักสูตรตามมาตรฐานคุณวุฒิระดับอุดมศึกษา 
            ประกอบด้วยข้อมูลโครงสร้างหลักสูตร แผนการศึกษา และรายละเอียดรายวิชา
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
};

export default Course;