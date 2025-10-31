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
                style={{ minHeight: '450px' }}
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

                {/* Image Section with Category Badge */}
                <div className='w-full h-48 sm:h-56 overflow-hidden relative rounded-t-2xl'>
                    <img
                        src={news?.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop'}
                        alt={news?.title || 'ข่าวสาร'}
                        className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out'
                    />
                    {/* Image overlay for additional glass effect */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500'></div>
                    
                    {/* Category Badge */}
                    {news?.category && (
                        <div className='absolute top-4 right-4'>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${getCategoryColor(news.category)}`}>
                                {news.category}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className='p-6 flex flex-col flex-grow relative z-10'>
                    {/* Date and Author Info */}
                    {(news?.date || news?.author) && (
                        <div className='flex items-center gap-3 mb-3 text-xs text-gray-600 flex-wrap'>
                            {news?.date && (
                                <div className='flex items-center gap-1'>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{news.date}</span>
                                </div>
                            )}
                            {news?.author && (
                                <div className='flex items-center gap-1'>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{news.author}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <h3 className='text-xl font-semibold mb-2 line-clamp-2'>
                        {news?.title || 'ข่าวสารล่าสุด'}
                    </h3>
                    <p className='text-base mb-4 flex-grow line-clamp-3'>
                        {news?.excerpt || 'รายละเอียดข่าวสาร...'}
                    </p>
                    
                    {/* Read More Button with glass effect */}
                    <div className='mt-auto pt-4'>
                        <div
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewsCard;