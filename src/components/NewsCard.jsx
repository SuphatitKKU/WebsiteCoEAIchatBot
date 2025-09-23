import React, { useState } from 'react';

// CSS styles (normally would be in separate file)
const liquidGlassStyles = `
@keyframes liquid-gradient-animation {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

.liquid-glass {
    position: relative;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
    overflow: hidden;
    transform-style: preserve-3d;
}

.liquid-overlay {
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.05) 20%,
        transparent 50%,
        rgba(255, 255, 255, 0.05) 80%,
        rgba(255, 255, 255, 0.1) 100%
    );
    background-size: 200% 200%;
    animation: liquid-gradient-animation 15s ease infinite;
    opacity: 0.7;
    pointer-events: none;
    z-index: 0;
    filter: blur(5px);
    transition: opacity 0.3s ease;
}

.liquid-glass:hover .liquid-overlay {
    opacity: 0.9;
}

.liquid-glass::before,
.liquid-glass::after {
    content: '';
    position: absolute;
    border-radius: inherit;
    pointer-events: none;
    z-index: 1;
}

.liquid-glass::before {
    inset: 0;
    background: radial-gradient(
        circle at top left,
        rgba(255, 255, 255, 0.3) 0%,
        transparent 30%
    );
    opacity: 0.7;
    transition: opacity 0.3s ease;
}

.liquid-glass:hover::before {
    opacity: 1;
}

.liquid-glass::after {
    inset: 1px;
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
    );
    opacity: 0.5;
    transition: opacity 0.3s ease;
}

.liquid-glass:hover::after {
    opacity: 0.7;
}

.liquid-glass h3 {
    color: #000000 !important;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.liquid-glass:hover h3 {
    color: #111111 !important;
    text-shadow: 0 1px 3px rgba(255, 255, 255, 0.9);
}

.liquid-glass p {
    color: #333333 !important;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
}

.liquid-glass:hover p {
    color: #000000 !important;
    text-shadow: 0 1px 3px rgba(255, 255, 255, 0.8);
}

.liquid-glass-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px) saturate(150%);
    -webkit-backdrop-filter: blur(10px) saturate(150%);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    color: #000000;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.liquid-glass-button::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.2) 0%,
        transparent 50%,
        rgba(255, 255, 255, 0.1) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
}

.liquid-glass-button:hover::before {
    opacity: 0.3;
}

.liquid-glass-button:hover {
    background: linear-gradient(
        135deg,
        rgba(154, 21, 24, 0.8) 0%,
        rgba(154, 21, 24, 0.9) 50%,
        rgba(120, 16, 19, 0.8) 100%
    );
    box-shadow: 0 6px 20px rgba(154, 21, 24, 0.4);
    transform: translateY(-1px);
    border-color: rgba(154, 21, 24, 0.6) !important;
    color: white !important;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
`;

const NewsCard = ({ news }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: liquidGlassStyles }} />
            <div 
                className={`
                    group relative overflow-hidden rounded-2xl
                    transition-all duration-500 ease-out
                    hover:scale-[1.02] active:scale-[1.02]
                    flex flex-col
                    cursor-pointer
                    liquid-glass
                    shadow-lg hover:shadow-2xl
                    bg-gradient-to-br from-blue-50 to-purple-50
                `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ minHeight: '400px' }}
            >
                {/* Liquid animated overlay */}
                <div className="liquid-overlay absolute inset-0 rounded-2xl pointer-events-none" />

                {/* Border hover effect */}
                <div
                    className="
                        absolute inset-0 rounded-2xl
                        border-2 border-transparent
                        group-hover:border-red-400/60 group-active:border-red-400/60
                        transition-all duration-500
                        pointer-events-none
                    "
                />

                {/* Image Section */}
                <div className='w-full h-48 sm:h-56 overflow-hidden relative rounded-t-2xl'>
                    <img
                        src={news?.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop'}
                        alt={news?.title || 'News Image'}
                        className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out'
                    />
                    {/* Image overlay for additional glass effect */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500'></div>
                </div>

                {/* Content Section */}
                <div className='p-6 flex flex-col flex-grow relative z-10'>
                    <h3 className='text-xl font-semibold mb-2 line-clamp-2'>
                        {news?.title || 'ข่าวสารล่าสุดเกี่ยวกับเทคโนโลยีและนวัตกรรม'}
                    </h3>
                    <p className='text-base mb-4 flex-grow line-clamp-3'>
                        {news?.description || 'รายละเอียดข่าวสารที่น่าสนใจและอัพเดทล่าสุด พร้อมข้อมูลที่เป็นประโยชน์สำหรับผู้อ่านทุกท่าน ติดตามข่าวสารและความเคลื่อนไหวใหม่ๆ ที่จะส่งผลต่อชีวิตประจำวัน'}
                    </p>
                    
                    {/* Read More Button with glass effect */}
                    <div className='mt-auto pt-4'>
                        <a
                            href="#"
                            className={`
                                inline-flex items-center gap-2 px-4 py-2 rounded-lg
                                font-medium text-sm
                                liquid-glass-button
                                border border-white/30
                                hover:border-red-600/60
                                transition-all duration-300
                                group/button
                            `}
                        >
                            อ่านเพิ่มเติม 
                            <span className='transform group-hover/button:translate-x-1 transition-transform duration-300'>
                                →
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};


export default NewsCard;