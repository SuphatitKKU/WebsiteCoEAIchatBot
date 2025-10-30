import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Globe, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('ขอบคุณสำหรับข้อความของคุณ! เราจะติดต่อกลับโดยเร็วที่สุด');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      paddingBottom: '170px',
      overflow: 'hidden' // ป้องกันรูปล้นออกไป
    }}>
      {/* Background images - ปรับให้ responsive */}
      <div 
        style={{ 
          position: 'absolute',
          width: 'min(700px, 80vw)', // ปรับขนาดตามหน้าจอ
          height: 'min(700px, 80vw)',
          top: 'clamp(-180px, -10vh, 0px)', 
          right: 'clamp(-100px, 1vw, 10px)',
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
          bottom: 'clamp(50px, 10vh, 100px)', 
          left: 'clamp(-100px, 1vw, 10px)',
          opacity: 0.7,
          pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(125, 19, 21, 0.15) 0%, transparent 70%)',
          zIndex: 0
        }}
      />

      {/* Content wrapper */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: 'clamp(1rem, 3vw, 2rem)' // Responsive padding
      }}>
        
        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
          <h1 style={{ 
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', // Responsive font size
            fontWeight: 'bold', 
            marginBottom: '0.5rem',
            color: '#1a1a1a'
          }}>
            ติดต่อเรา
          </h1>
          <div style={{
            width: 'clamp(60px, 10vw, 80px)',
            height: '4px',
            background: 'linear-gradient(to right, #dc2626, #7d1315)',
            margin: '1rem auto',
            borderRadius: '2px'
          }}></div>
          <p style={{ 
            color: '#666', 
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            padding: '0 1rem'
          }}>
            ติดต่อสอบถามข้อมูล หรือนัดหมายเยี่ยมชมคณะวิศวกรรมคอมพิวเตอร์
          </p>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: 'clamp(1rem, 3vw, 2rem)',
          marginBottom: 'clamp(2rem, 4vw, 3rem)'
        }}>
          
          {/* Contact Info Cards */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'clamp(16px, 3vw, 24px)',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            <div style={{
              width: 'clamp(50px, 8vw, 60px)',
              height: 'clamp(50px, 8vw, 60px)',
              background: 'linear-gradient(135deg, #dc2626 0%, #7d1315 100%)',
              borderRadius: 'clamp(12px, 2vw, 16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <MapPin size={Math.min(30, window.innerWidth * 0.05)} color="white" />
            </div>
            <h3 style={{ 
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1a1a1a'
            }}>
              ที่อยู่
            </h3>
            <p style={{ 
              color: '#666', 
              lineHeight: '1.8',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)'
            }}>
              ภาควิชาวิศวกรรมคอมพิวเตอร์<br />
              คณะวิศวกรรมศาสตร์<br />
              มหาวิทยาลัยขอนแก่น<br />
              123 ถนนมิตรภาพ ต.ในเมือง<br />
              อ.เมือง จ.ขอนแก่น 40002
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'clamp(16px, 3vw, 24px)',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            <div style={{
              width: 'clamp(50px, 8vw, 60px)',
              height: 'clamp(50px, 8vw, 60px)',
              background: 'linear-gradient(135deg, #dc2626 0%, #7d1315 100%)',
              borderRadius: 'clamp(12px, 2vw, 16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <Phone size={Math.min(30, window.innerWidth * 0.05)} color="white" />
            </div>
            <h3 style={{ 
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1a1a1a'
            }}>
              โทรศัพท์
            </h3>
            <div style={{ 
              color: '#666', 
              lineHeight: '1.8',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)'
            }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>สำนักงานภาควิชา:</strong><br />
                043-202-845
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>หัวหน้าภาควิชา:</strong><br />
                043-202-846
              </p>
              <p>
                <strong>ฝ่ายวิชาการ:</strong><br />
                043-202-847
              </p>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'clamp(16px, 3vw, 24px)',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            <div style={{
              width: 'clamp(50px, 8vw, 60px)',
              height: 'clamp(50px, 8vw, 60px)',
              background: 'linear-gradient(135deg, #dc2626 0%, #7d1315 100%)',
              borderRadius: 'clamp(12px, 2vw, 16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <Mail size={Math.min(30, window.innerWidth * 0.05)} color="white" />
            </div>
            <h3 style={{ 
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1a1a1a'
            }}>
              อีเมล
            </h3>
            <div style={{ 
              color: '#666', 
              lineHeight: '1.8',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              wordBreak: 'break-word' // ป้องกันอีเมลยาวล้น
            }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>ทั่วไป:</strong><br />
                <a href="mailto:com@kku.ac.th" style={{ color: '#dc2626', textDecoration: 'none' }}>
                  com@kku.ac.th
                </a>
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>สอบถามหลักสูตร:</strong><br />
                <a href="mailto:admission.com@kku.ac.th" style={{ color: '#dc2626', textDecoration: 'none' }}>
                  admission.com@kku.ac.th
                </a>
              </p>
              <p>
                <strong>ฝ่ายวิจัย:</strong><br />
                <a href="mailto:research.com@kku.ac.th" style={{ color: '#dc2626', textDecoration: 'none' }}>
                  research.com@kku.ac.th
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Office Hours & Social Media */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: 'clamp(1rem, 3vw, 2rem)',
          marginBottom: 'clamp(2rem, 4vw, 3rem)'
        }}>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'clamp(16px, 3vw, 24px)',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            <div style={{
              width: 'clamp(50px, 8vw, 60px)',
              height: 'clamp(50px, 8vw, 60px)',
              background: 'linear-gradient(135deg, #dc2626 0%, #7d1315 100%)',
              borderRadius: 'clamp(12px, 2vw, 16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <Clock size={Math.min(30, window.innerWidth * 0.05)} color="white" />
            </div>
            <h3 style={{ 
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1a1a1a'
            }}>
              เวลาทำการ
            </h3>
            <div style={{ 
              color: '#666', 
              lineHeight: '1.8',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)'
            }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>จันทร์ - ศุกร์</strong><br />
                08:30 - 16:30 น.
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>เสาร์ - อาทิตย์</strong><br />
                ปิดทำการ
              </p>
              <p style={{ 
                padding: '0.75rem',
                background: 'rgba(220, 38, 38, 0.1)',
                borderRadius: '8px',
                marginTop: '1rem',
                fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)'
              }}>
                💡 หยุดตามวันหยุดนักขัตฤกษ์
              </p>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'clamp(16px, 3vw, 24px)',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            <div style={{
              width: 'clamp(50px, 8vw, 60px)',
              height: 'clamp(50px, 8vw, 60px)',
              background: 'linear-gradient(135deg, #dc2626 0%, #7d1315 100%)',
              borderRadius: 'clamp(12px, 2vw, 16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <Globe size={Math.min(30, window.innerWidth * 0.05)} color="white" />
            </div>
            <h3 style={{ 
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1a1a1a'
            }}>
              ช่องทางออนไลน์
            </h3>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 2.5vw, 1rem)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  color: '#1877f2',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 119, 242, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Facebook size={24} />
                <span>Facebook Page</span>
              </a>
              
              <a
                href="https://eng.kku.ac.th"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 2.5vw, 1rem)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  color: '#dc2626',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Globe size={24} />
                <span>เว็บไซต์คณะ</span>
              </a>
            </div>
          </div>

        </div>

        {/* Map Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'clamp(16px, 3vw, 24px)',
          padding: 'clamp(1.5rem, 3vw, 2rem)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          marginBottom: '2rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: '#1a1a1a'
            }}>
              แผนที่ตั้ง
            </h2>
            <div style={{
              width: 'clamp(50px, 8vw, 60px)',
              height: '3px',
              background: 'linear-gradient(to right, #dc2626, #7d1315)',
              margin: '1rem auto',
              borderRadius: '2px'
            }}></div>
          </div>

          <div style={{
            borderRadius: 'clamp(12px, 2vw, 16px)',
            overflow: 'hidden',
            border: '2px solid rgba(0,0,0,0.1)',
            height: 'clamp(300px, 50vw, 450px)', // Responsive height
            background: '#f0f0f0'
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.664755555556!2d102.81472!3d16.46778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31228a1b3f0d1b1f%3A0x1b1b1b1b1b1b1b1b!2sKhon%20Kaen%20University!5e0!3m2!1sen!2sth!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              allowFullScreen
              loading="lazy"
              title="แผนที่คณะวิศวกรรมศาสตร์ มข."
            />
          </div>
        </div>

        {/* Info Note */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'clamp(12px, 2vw, 16px)',
          padding: 'clamp(1rem, 2.5vw, 1.5rem)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          textAlign: 'center'
        }}>
          <p style={{ 
            color: '#666', 
            margin: 0, 
            lineHeight: '1.6',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}>
            <strong style={{ color: '#1a1a1a' }}>หมายเหตุ:</strong> หากต้องการข้อมูลเพิ่มเติมหรือนัดหมายเข้าพบ 
            กรุณาติดต่อล่วงหน้าอย่างน้อย 3 วันทำการ เพื่อให้เราสามารถเตรียมการต้อนรับท่านได้อย่างเหมาะสม
          </p>
        </div>
      </div>
    </main>
  );
};

export default Contact;