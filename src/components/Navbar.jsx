import React, { useState } from 'react'
import assets from '../assets/assets'

export const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='flex justify-between items-center px-4 sm:px-12 lg:px-24 xl:px-40 py-4 sticky top-0 z-50
      backdrop-blur-xl bg-white/20 border border-white/30 
      shadow-[0_4px_30px_rgba(0,0,0,0.1)] 
      before:content-[""] before:absolute before:inset-0 
      before:bg-gradient-to-br before:from-white/40 before:to-transparent 
      before:pointer-events-none relative '>

      {/* Logo */}
      <img src={assets.logo} className='w-32 sm:w-40 relative z-10' alt='Logo'/>

      {/* Menu */}
      <div className={`text-gray-700 sm:text-base ${!sidebarOpen ? 'max-sm:w-0 overflow-hidden': 'max-sm:w-60 max-sm:pl-10'}
        max-sm:fixed top-0 bottom-0 right-0 max-sm:min-h-screen max-sm:h-full max-sm:flex-col
        max-sm:bg-primary max-sm:text-white max-sm:pt-20 flex sm:items-center gap-5 transition-all z-50`}>

        <img 
          src={assets.close_icon} 
          alt="Close" 
          className='w-5 absolute right-4 top-4 sm:hidden cursor-pointer' 
          onClick={() => setSidebarOpen(false)}
        />

        <a onClick={()=>setSidebarOpen(false)} href="#" className='sm:hover:text-primary transition-colors'>หน้าหลัก</a>
        <a onClick={()=>setSidebarOpen(false)} href="#admission" className='sm:hover:text-primary transition-colors'>เกณฑ์การรับเข้า</a>
        <a onClick={()=>setSidebarOpen(false)} href="#course" className='sm:hover:text-primary transition-colors'>ข้อมูลหลักสูตร</a>
        <a onClick={()=>setSidebarOpen(false)} href="#activity" className='sm:hover:text-primary transition-colors'>แนะแนว&กิจกรรม</a>
        <a onClick={()=>setSidebarOpen(false)} href="#contact-us" className='sm:hover:text-primary transition-colors'>ติดต่อ</a>
      </div>

      {/* Right Buttons */}
      <div className='flex items-center gap-2 sm:gap-4 relative z-10'>
        <img 
          src={assets.menu_icon} 
          alt="Menu" 
          onClick={() => setSidebarOpen(true)} 
          className='w-8 sm:hidden cursor-pointer'
        />

        <a href="#contact-us" className='text-sm max-sm:hidden flex items-center 
          gap-2 bg-primary text-white px-6 py-2 rounded-full cursor-pointer hover:scale-105 transition-all'>
          ข้อมูลติดต่อ →
        </a>
      </div>
    </div>
  )
}

export default Navbar
