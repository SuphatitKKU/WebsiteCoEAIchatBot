import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from 'lucide-react';
import assets from '../assets/assets';
import Title from './Title';
import NewsCard from './NewsCard';
import { getAllPublishedNews } from '../firebase/newsService';

const News = () => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);

    // ดึงข่าวล่าสุด 3 ข่าวจาก Firebase (แหล่งเดียวกับ Activity)
    useEffect(() => {
        const fetchLatestNews = async () => {
            try {
                setLoading(true);
                const allNews = await getAllPublishedNews();
                // เอาแค่ 3 ข่าวแรก (ข่าวล่าสุด)
                const latestThreeNews = allNews.slice(0, 3);
                setNewsData(latestThreeNews);
            } catch (error) {
                console.error('Error loading news:', error);
                // ถ้าโหลดไม่ได้ ให้แสดงข้อมูล placeholder
                setNewsData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestNews();
    }, []);

    return (
        <>
            {/* Inline style สำหรับทุก breakpoint */}
            <style>
                {`
                    /* Mobile (default) */
                    .news-responsive {
                        margin-top: -130px;
                    }

                    /* Notebook - ประมาณ 1024px - 1599px */
                    @media (min-width: 1024px) and (max-width: 1599px) {
                        .news-responsive {
                            margin-top: -130px;
                        }
                    }

                    /* Desktop - 1600px ขึ้นไป */
                    @media (min-width: 1600px) {
                        .news-responsive {
                            margin-top: -430px;
                        }
                    }
                `}
            </style>

            <div className='relative news-responsive'>
                <img 
                    src={assets.bgImage1} 
                    alt="" 
                    className='absolute top-0 right-0 w-[800px] h-[800px] object-contain opacity-70 pointer-events-none z-0'
                    style={{ 
                        top: '-160px', 
                        right: '-130px' 
                    }}
                />

                <div id='News' className='relative min-h-screen px-4 sm:px-12 lg:px-24 xl:px-40 py-16 overflow-hidden z-10'>
                    <div className='relative z-20 flex flex-col items-center gap-12'>
                        {/* Title Section */}
                        <div className='text-center max-w-4xl'>
                            <Title
                                title='ข่าวประชาสัมพันธ์'
                                desc='ติดตามข่าวสารและกิจกรรมต่างๆ ของคณะวิศวกรรมคอมพิวเตอร์และวิศวกรรมสื่อดิจิตอล มหาวิทยาลัยขอนแก่น'
                            />
                            {/* ปุ่มดูข่าวทั้งหมด */}
                            <Link to="/activity">
                                <button className='mt-6 px-5 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white text-sm font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300'>
                                    ดูข่าวทั้งหมด →
                                </button>
                            </Link>
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className='flex flex-col items-center justify-center py-12'>
                                <Loader className="animate-spin mb-4" size={48} color="#dc2626" />
                                <p className='text-gray-600 text-lg'>กำลังโหลดข่าวล่าสุด...</p>
                            </div>
                        ) : newsData.length > 0 ? (
                            <>
                                {/* News Cards Grid */}
                                <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
                                    {newsData.map((newsItem, index) => (
                                        <Link 
                                            key={newsItem.id || index}
                                            to="/activity"
                                            className='block'
                                        >
                                            <NewsCard news={newsItem} />
                                        </Link>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className='text-center py-12'>
                                <p className='text-gray-600 text-lg mb-4'>ยังไม่มีข่าวสารในขณะนี้</p>
                                <Link to="/activity">
                                    <button className='px-6 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300'>
                                        ไปหน้าข่าวสาร
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default News;