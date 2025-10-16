import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import assets from '../assets/assets'

export const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div
      className='flex justify-between items-center px-4 sm:px-12 lg:px-24 xl:px-40 py-4
                 sticky top-0 z-50 backdrop-blur-xl bg-white/20 border border-white/30
                 shadow-[0_4px_30px_rgba(0,0,0,0.1)]
                 before:content-[""] before:absolute before:inset-0
                 before:bg-gradient-to-br before:from-white/40 before:to-transparent
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

      {/* Desktop Menu - ซ่อนตามค่าเริ่มต้นและแสดงเฉพาะบนหน้าจอขนาดใหญ่ (lg ขึ้นไป) */}
      <div className='hidden lg:flex items-center gap-6 lg:gap-8 text-gray-700 text-base lg:text-lg'>
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

      {/* Mobile Sidebar - แสดงตามค่าเริ่มต้นและซ่อนเฉพาะบนหน้าจอขนาดใหญ่ (lg ขึ้นไป) */}
      <div
        className={`fixed top-0 bottom-0 right-0 z-50
          ${sidebarOpen ? 'w-72' : 'w-0'}
          overflow-hidden transition-all duration-300 ease-in-out
          bg-primary text-white min-h-screen flex flex-col pt-16
          lg:hidden` /* This is the corrected line */ }
      >
        <img
          src={assets.close_icon}
          alt="Close"
          className='w-6 absolute right-4 top-4 cursor-pointer hover:scale-110 transition-transform'
          onClick={() => setSidebarOpen(false)}
        />

        <div className='flex flex-col gap-6 px-8 py-8'>
          <Link 
            to="/" 
            onClick={() => setSidebarOpen(false)} 
            className={`text-lg py-2 border-b border-white/20 hover:text-white/80 transition-colors ${
              isActive('/') ? 'font-semibold text-white' : 'text-white/90'
            }`}
          >
            หน้าหลัก
          </Link>
          
          <Link 
            to="/admission" 
            onClick={() => setSidebarOpen(false)} 
            className={`text-lg py-2 border-b border-white/20 hover:text-white/80 transition-colors ${
              isActive('/admission') ? 'font-semibold text-white' : 'text-white/90'
            }`}
          >
            เกณฑ์การรับเข้า
          </Link>
          
          <Link 
            to="/course" 
            onClick={() => setSidebarOpen(false)} 
            className={`text-lg py-2 border-b border-white/20 hover:text-white/80 transition-colors ${
              isActive('/course') ? 'font-semibold text-white' : 'text-white/90'
            }`}
          >
            ข้อมูลหลักสูตร
          </Link>
          
          <Link 
            to="/activity" 
            onClick={() => setSidebarOpen(false)} 
            className={`text-lg py-2 border-b border-white/20 hover:text-white/80 transition-colors ${
              isActive('/activity') ? 'font-semibold text-white' : 'text-white/90'
            }`}
          >
            แนะแนว&กิจกรรม
          </Link>
          
          <Link 
            to="/contact" 
            onClick={() => setSidebarOpen(false)} 
            className={`text-lg py-2 border-b border-white/20 hover:text-white/80 transition-colors ${
              isActive('/contact') ? 'font-semibold text-white' : 'text-white/90'
            }`}
          >
            ติดต่อ
          </Link>

          {/* ปุ่มข้อเสนอแนะสำหรับมือถือ */}
          <Link
            to="/feedback"
            onClick={() => setSidebarOpen(false)}
            className='flex items-center justify-center gap-2
                       bg-white text-primary px-6 py-3 rounded-full mt-6
                       cursor-pointer hover:scale-105 transition-all
                       font-semibold text-base shadow-lg'
          >
            ข้อเสนอแนะ →
          </Link>
        </div>
      </div>

      {/* Right Side - Desktop Button & Mobile Menu Icon */}
      <div className='flex items-center gap-3 relative z-10'>
        {/* Mobile Menu Button - แสดงตามค่าเริ่มต้นและซ่อนเฉพาะบนหน้าจอขนาดใหญ่ (lg ขึ้นไป) */}
        <button
          onClick={() => setSidebarOpen(true)}
          className='p-2 hover:bg-black/10 rounded-lg transition-colors lg:hidden'
          aria-label="Open menu"
        >
          <img
            src={assets.menu_icon}
            alt="Menu"
            className='w-6 h-6'
          />
        </button>

        {/* Desktop CTA Button - ซ่อนตามค่าเริ่มต้นและแสดงเฉพาะบนหน้าจอขนาดใหญ่ (lg ขึ้นไป) */}
        <Link
          to="/feedback"
          className='hidden lg:flex items-center gap-2
                     bg-primary text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full
                     cursor-pointer hover:scale-105 hover:bg-primary/90 
                     transition-all font-medium text-sm lg:text-base
                     shadow-lg hover:shadow-xl'
        >
          ข้อเสนอแนะ →
        </Link>
      </div>
    </div>
  )
}

export default Navbar