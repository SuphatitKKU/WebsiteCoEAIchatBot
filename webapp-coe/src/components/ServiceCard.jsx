import React, { useState } from 'react';
import './liquidGlass.css'; // เพิ่มไฟล์ css แยก

const ServiceCard = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl p-6
        transition-all duration-500 ease-out
        hover:scale-[1.02] active:scale-[1.02]
        flex items-center gap-6
        min-h-[160px] w-full
        cursor-pointer
        liquid-glass
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

      {/* Icon container */}
      <div
        className="
          flex-shrink-0 w-16 h-16 rounded-xl 
          flex items-center justify-center
          group-hover:scale-105 group-active:scale-105
          transition-all duration-300 ease-out
          relative z-10
        "
      >
        {service?.icon ? (
          <img
            src={service.icon}
            alt={service.title}
            className="w-8 h-8 object-contain filter drop-shadow-lg"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 min-w-0">
        <h3
          className="text-lg font-bold mb-2 truncate text-black"
        >
          {service?.title || 'Service Title'}
        </h3>
        <p
          className="leading-relaxed line-clamp-2 font-medium text-sm text-black"
        >
          {service?.description ||
            'Service description goes here with details about what this service offers.'}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;