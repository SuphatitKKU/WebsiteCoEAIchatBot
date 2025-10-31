import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, ArrowRight, Loader } from 'lucide-react';
import { getAllPublishedNews } from '../firebase/newsService';

const ITEMS_PER_PAGE = 6;

const Activity = () => {
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูลจาก Firebase
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await getAllPublishedNews();
        setNewsData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading news:', err);
        setError('ไม่สามารถโหลดข่าวได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const totalPages = Math.ceil(newsData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNews = newsData.slice(startIndex, endIndex);

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
      'กิจกรรมอาสา': 'bg-teal-100 text-teal-700',
      'ทั่วไป': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // Loading state
  if (loading) {
    return (
      <main style={{ 
        position: 'relative', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader className="animate-spin mx-auto mb-4" size={48} color="#dc2626" />
          <p style={{ color: '#666', fontSize: '1.1rem' }}>กำลังโหลดข่าวสาร...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main style={{ 
        position: 'relative', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ 
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ color: '#dc2626', fontSize: '1.1rem', marginBottom: '1rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #dc2626 0%, #7d1315 100%)',
              color: 'white',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            โหลดใหม่
          </button>
        </div>
      </main>
    );
  }

  // News detail view
  if (selectedNews) {
    return (
      <main style={{ position: 'relative', minHeight: '100vh', paddingBottom: '170px', overflow: 'hidden' }}>
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
            {selectedNews.image && (
              <img 
                src={selectedNews.image} 
                alt={selectedNews.title}
                style={{
                  width: '100%',
                  height: 'clamp(250px, 40vw, 400px)',
                  objectFit: 'cover'
                }}
              />
            )}
            
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

  // News list view
  return (
    <main style={{ position: 'relative', minHeight: '100vh', paddingBottom: '170px', overflow: 'hidden' }}>
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

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: 'clamp(1rem, 4vw, 2rem)' }}>
        
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

        {newsData.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '16px'
          }}>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>ยังไม่มีข่าวสารในขณะนี้</p>
          </div>
        ) : (
          <>
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
                    {news.image ? (
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
                    ) : (
                      <div style={{
                        width: '100%',
                        height: 'clamp(180px, 30vw, 200px)',
                        background: 'linear-gradient(135deg, #dc2626 0%, #7d1315 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                      }}>
                        ข่าว
                      </div>
                    )}
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

            {totalPages > 1 && (
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
                >
                  <span>ถัดไป</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Activity;