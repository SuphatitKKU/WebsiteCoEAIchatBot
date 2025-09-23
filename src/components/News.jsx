import React from 'react';
import assets from '../assets/assets';
import Title from './Title';
import NewsCard from './NewsCard';

const News = () => {
    const NewsData = [
        {
            title: 'ข่าวการรับนักศึกษาใหม่',
            description: 'ประกาศรับสมัครนักศึกษาใหม่ หลักสูตรวิศวกรรมคอมพิวเตอร์และวิศวกรรมสื่อดิจิตอล ปีการศึกษา 2568',
            image: assets.news1
        },
        {
            title: 'กิจกรรมวิชาการและงานวิจัย',
            description: 'ข่าวสารเกี่ยวกับการประชุมวิชาการ การนำเสนองานวิจัย และความร่วมมือทางวิชาการกับหน่วยงานต่างๆ',
            image: assets.news2
        },
        {
            title: 'ผลงานนักศึกษาและบุคลากร',
            description: 'เผยแพร่ผลงานดีเด่นของนักศึกษาและอาจารย์ รางวัลที่ได้รับ และความสำเร็จในการแข่งขัน',
            image: assets.news3
        }
    ];

    return (
        <>
            {/* Inline style สำหรับทุก breakpoint */}
            <style>
                {`
                    /* Mobile (default) */
                    .news-responsive {
                        margin-top: -50px;
                    }

                    /* Notebook - ประมาณ 1024px - 1599px */
                    @media (min-width: 1024px) and (max-width: 1599px) {
                        .news-responsive {
                            margin-top: -100px;
                        }
                    }

                    /* Desktop - 1600px ขึ้นไป */
                    @media (min-width: 1600px) {
                        .news-responsive {
                            margin-top: -330px;
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
                        </div>

                        {/* News Cards Grid */}
                        <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
                            {NewsData.map((newsItem, index) => (
                                <NewsCard key={index} news={newsItem} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default News;