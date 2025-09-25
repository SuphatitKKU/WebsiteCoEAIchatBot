import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import assets from '../assets/assets'

export const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // ฟังก์ชันเช็คว่า link นั้นเป็นหน้าปัจจุบันหรือไม่
  const isActive = (path) => location.pathname === path

  return (
    <div
      className='flex justify-between items-center px-4 sm:px-12 lg:px-24 xl:px-40 py-4
                 sticky top-0 z-50 backdrop-blur-xl bg-white/60 border border-white/40
                 shadow-[0_4px_30px_rgba(0,0,0,0.05)]
                 before:content-[""] before:absolute before:inset-0
                 before:bg-gradient-to-br before:from-white/60 before:to-white/30
                 before:pointer-events-none relative'
    >
      {/* Logo */}
      <Link to="/" className="flex-shrink-0">
        <img
          src={assets.logo}
          className='w-28 sm:w-32 md:w-36 lg:w-40 relative z-10 cursor-pointer'
          alt='Logo'
        />
      </Link>

      {/* Desktop Menu */}
      <div className='hidden sm:flex items-center gap-6 lg:gap-8 text-gray-700 text-base lg:text-lg'>
        <Link 
          to="/" 
          className={`hover:text-primary transition-colors ${
            isActive('/') ? 'text-primary font-semibold' : ''
          }`}
        >
          หน้าหลัก
        </Link>
        
        <Link 
          to="/admission" 
          className={`hover:text-primary transition-colors ${
            isActive('/admission') ? 'text-primary font-semibold' : ''
          }`}
        >
          เกณฑ์การรับเข้า
        </Link>
        
        <Link 
          to="/course" 
          className={`hover:text-primary transition-colors ${
            isActive('/course') ? 'text-primary font-semibold' : ''
          }`}
        >
          ข้อมูลหลักสูตร
        </Link>
        
        <Link 
          to="/activity" 
          className={`hover:text-primary transition-colors ${
            isActive('/activity') ? 'text-primary font-semibold' : ''
          }`}
        >
          แนะแนว&กิจกรรม
        </Link>
        
        <Link 
          to="/contact" 
          className={`hover:text-primary transition-colors ${
            isActive('/contact') ? 'text-primary font-semibold' : ''
          }`}
        >
          ติดต่อ
        </Link>
      </div>

      {/* Mobile Sidebar - ปรับให้สว่างขึ้น */}
      <div
        className={`sm:hidden fixed top-0 bottom-0 right-0 z-50
          ${sidebarOpen ? 'w-72' : 'w-0'}
          overflow-hidden transition-all duration-300 ease-in-out
          bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl 
          border-l border-gray-200/50 text-gray-700 min-h-screen flex flex-col pt-16
          shadow-xl`}
      >
        <img
          src={assets.close_icon}
          alt="Close"
          className='w-6 absolute right-4 top-4 cursor-pointer hover:scale-110 transition-transform
                     filter brightness-0 opacity-70 hover:opacity-100'
          onClick={() => setSidebarOpen(false)}
        />

        <div className='flex flex-col gap-6 px-8 py-8'>
          <Link 
            to="/" 
            onClick={() => setSidebarOpen(false)} 
            className={`text-lg py-2 border-b border-gray-200/50 hover:text-primary transition-colors ${
              isActive('/') ? 'font-semibold text-primary' : 'text-gray-700'
            }`}
          >
            หน้าหลัก
          </Link>
          
          <Link 
            to="/admission" 
            onClick={() => setSidebarOpen(false)} 
            className={`text-lg py-2 border-b border-gray-200/50 hover:text-primary transition-colors ${
              isActive('/admission') ? 'font-semibold text-primary' : 'text-gray-700'
            }`}
          >
            เกณฑ์การรับเข้า
          </Link>
          
          <Link 
            to="/course" 
            onClick={() => setSidebarOpen(false)} 
            className={`text-lg py-2 border-b border-gray-200/50 hover:text-primary transition-colors ${
              isActive('/course') ? 'font-semibold text-primary' : 'text-gray-700'
            }`}
          >
            ข้อมูลหลักสูตร
          </Link>
          
          <Link 
            to="/activity" 
            onClick={() => setSidebarOpen(false)} 
            className={`text-lg py-2 border-b border-gray-200/50 hover:text-primary transition-colors ${
              isActive('/activity') ? 'font-semibold text-primary' : 'text-gray-700'
            }`}
          >
            แนะแนว&กิจกรรม
          </Link>
          
          <Link 
            to="/contact" 
            onClick={() => setSidebarOpen(false)} 
            className={`text-lg py-2 border-b border-gray-200/50 hover:text-primary transition-colors ${
              isActive('/contact') ? 'font-semibold text-primary' : 'text-gray-700'
            }`}
          >
            ติดต่อ
          </Link>

          {/* ปุ่มข้อเสนอแนะสำหรับมือถือ */}
          <Link
            to="/feedback"
            onClick={() => setSidebarOpen(false)}
            className='flex items-center justify-center gap-2
                       bg-primary text-white px-6 py-3 rounded-full mt-6
                       cursor-pointer hover:scale-105 hover:bg-primary/90 transition-all
                       font-semibold text-base shadow-lg hover:shadow-xl'
          >
            ข้อเสนอแนะ →
          </Link>
        </div>
      </div>

      {/* Right Side - Desktop Button & Mobile Menu Icon */}
      <div className='flex items-center gap-3 relative z-10'>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className='sm:hidden p-2 hover:bg-white/20 rounded-lg transition-colors
                     border border-gray-200/30 bg-white/10 backdrop-blur-sm'
          aria-label="Open menu"
        >
          <img
            src={assets.menu_icon}
            alt="Menu"
            className='w-6 h-6 filter brightness-0 opacity-70'
          />
        </button>

        {/* Desktop CTA Button */}
        <Link
          to="/feedback"
          className='hidden sm:flex items-center gap-2
                     bg-primary text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full
                     cursor-pointer hover:scale-105 hover:bg-primary/90 
                     transition-all font-medium text-sm lg:text-base
                     shadow-lg hover:shadow-xl'
        >
          ข้อเสนอแนะ →
        </Link>
      </div>

      {/* Mobile Backdrop - ปรับให้อ่อนลง */}
      {sidebarOpen && (
        <div 
          className="sm:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Navbar