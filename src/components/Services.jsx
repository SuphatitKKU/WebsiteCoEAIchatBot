import React from 'react'
import assets from '../assets/assets'
import Title from './Title'
import ServiceCard from './ServiceCard'

const Services = () => {

    const servicesData = [
        {
            title: 'เกณฑ์การรับเข้า',
            description: 'อธิบายคุณสมบัติและขั้นตอนการสมัครสำหรับผู้สนใจเข้าศึกษา',
            icon: assets.graduation_hat
        },
        {
            title: 'ข้อมูลหลักสูตร',
            description: 'แนะนำรายละเอียดหลักสูตร โครงสร้างรายวิชา และโอกาสทางอาชีพหลังสำเร็จการศึกษา',
            icon: assets.book_open
        },
        {
            title: 'แนะแนว & กิจกรรม',
            description: 'ให้คำปรึกษาด้านการเรียน พร้อมกิจกรรมเสริมสร้างทักษะและประสบการณ์นอกห้องเรียน',
            icon: assets.megaphone
        },
        {
            title: 'ติดต่อ',
            description: 'รวมช่องทางการติดต่อสถาบัน เช่น ที่อยู่ เบอร์โทร อีเมล และช่องทางออนไลน์',
            icon: assets.location
        }
    ]

    return (
        <div className='relative py-20'>
            {/* CSS อยู่ในไฟล์เดียวกัน */}
            <style>{`
                .services-wrapper {
                    margin-top: -130px; /* mobile default */
                }

                @media (min-width: 640px) {
                    .services-wrapper {
                        margin-top: -40px; /* tablet */
                    }
                }

                @media (min-width: 1024px) {
                    .services-wrapper {
                        margin-top: -64px; /* laptop */
                    }
                }
            `}</style>

            {/* Background Image */}
            <img 
                src={assets.bgImage1} 
                alt="" 
                className='absolute top-0 right-0 w-[800px] h-[800px] object-contain opacity-70 pointer-events-none z-0'
                style={{ 
                    top: '-160px', 
                    left: '-130px' 
                }}
            />
            
            <div 
                id='services' 
                className='services-wrapper relative min-h-screen px-4 sm:px-12 lg:px-24 xl:px-40 py-16 overflow-hidden z-10'
            >
                <div className='relative z-20 flex flex-col items-center gap-12'>
                    {/* Title Section */}
                    <div className='text-center max-w-4xl'>
                        <Title 
                            title='ข้อมูลการศึกษา' 
                            desc='รวมข้อมูลสำคัญสำหรับผู้สนใจ ตั้งแต่เกณฑ์การรับเข้า หลักสูตร กิจกรรม ไปจนถึงช่องทางการติดต่อสถาบัน'
                        />
                    </div>
                    
                    {/* Service Cards Grid */}
                    <div className='w-full max-w-7xl mx-auto'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 place-items-center md:place-items-stretch'>
                            {servicesData.map((service, index) => (
                                <div key={index} className='w-full max-w-lg md:max-w-none'>
                                    <ServiceCard service={service} index={index}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Services
