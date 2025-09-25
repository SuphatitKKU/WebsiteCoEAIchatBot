import React from 'react';

const Banner = () => {
  return (
    <>
      {/* CSS Animations - ใส่ไว้ใน component หรือไฟล์ CSS แยก */}
      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(20px) translateX(-5px); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(-10px); }
        }
        
        .animate-float-1 {
          animation: float-1 8s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 10s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float-3 9s ease-in-out infinite;
        }
      `}</style>

      <div className="relative w-full max-w-6xl h-[600px] flex justify-center items-center overflow-hidden rounded-2xl mx-auto my-8">
        {/* Background with engineering-themed colors and shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#9a1518] to-[#dc2626] flex justify-around items-center z-0">
          {/* Abstract shapes */}
          <div className="absolute top-1/4 left-[5%] w-48 h-48 bg-white rounded-full opacity-20 blur-xl animate-float-1"></div>
          <div className="absolute bottom-1/4 right-[10%] w-60 h-60 bg-white rounded-full opacity-20 blur-xl animate-float-2"></div>
          <div className="absolute top-1/2 left-[30%] w-32 h-32 bg-white rounded-full opacity-20 blur-xl animate-float-3"></div>
        </div>
        
        {/* Glassmorphism Card */}
        <div className="relative w-[90%] h-[90%] bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl border border-white border-opacity-20 p-8 flex flex-col justify-between z-10">
          {/* Navbar */}
          <nav className="flex justify-between items-center text-white text-opacity-80">
            <div className="flex items-center space-x-4">
              <div className="text-xs px-2 py-1 border border-white border-opacity-30 rounded-md">ENGINEERING UI</div>
            </div>
            <ul className="flex space-x-6 text-sm">
              <li><a href="#" className="hover:text-white transition-colors duration-200">HOME</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">FEATURES</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">DOCS</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">NEWS</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200"><i className="fas fa-search"></i></a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200"><i className="fas fa-bars"></i></a></li>
            </ul>
          </nav>
          
          {/* Main Content */}
          <div className="flex-grow flex flex-col justify-center items-start pl-4 text-white">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg mb-4">
              <h1 className="text-4xl font-bold tracking-wide">REACT</h1>
              <h2 className="text-4xl font-bold tracking-wide mt-[-0.5rem]">COMPONENTS</h2>
            </div>
            <p className="text-lg mb-6 max-w-sm text-white text-opacity-70">
              Build your projects with modular, reusable UI.
            </p>
            <button className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 rounded-md text-white font-medium">
              VIEW LIBRARY
            </button>
          </div>
          
          {/* Page Indicator */}
          <div className="flex space-x-2 pb-4 pl-4">
            <span className="w-2 h-2 bg-white rounded-full opacity-80"></span>
            <span className="w-2 h-2 bg-white rounded-full opacity-40"></span>
            <span className="w-2 h-2 bg-white rounded-full opacity-40"></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;