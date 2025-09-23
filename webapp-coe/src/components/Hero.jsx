import React from 'react'
import assets from '../assets/assets'

const Hero = () => {
  return (
    <div id='hero' className='flex flex-col items-center gap-6 py-15 px-4 sm:px-12 lg:px-24
    xl:px-40 text-center w-full overflow-hidden text-gray-700 relative'>
        <h1 className='font-medium xl:leading-[70px] max-w-5xl relative z-20 text-black'>
            <span className='text-lg sm:text-xl md:text-2xl xl:text-3xl font-regular'>ศูนย์ข้อมูลและคำปรึกษาออนไลน์</span> <br />
            <span className='text-4xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-medium block sm:inline'>วิศวกรรมคอมพิวเตอร์และสื่อดิจิทัล</span>
            <span className='hidden sm:inline'> </span>
            <span className='text-3xl sm:text-4xl md:text-5xl xl:text-5xl bg-gradient-to-r from-[#dc2626] to-[#7d1315] bg-clip-text text-transparent font-medium'>มหาวิทยาลัยขอนแก่น</span>
        </h1>

        <p className='text-sm sm:text-lg font-regular text-gray-500 max-w-4/5 sm:max-w-lg pb-3 -mt-5 relative z-20'>
            พัฒนาความรู้ ฝึกฝนทักษะ และเติบโตไปพร้อมกับเทคโนโลยีสมัยใหม่
        </p>

        <div className='relative z-10'>
            <img src={assets.hero_img} alt="" className='w-full max-w-6xl rounded-4xl relative z-10' />
            <img 
                src={assets.bgImage1} 
                alt="" 
                className='absolute w-[1000px] h-[1000px] z-0 pointer-events-none'
                style={{ 
                    top: '-350px', 
                    right: '-330px' 
                }}
            />
        </div>

    </div>
  )
}

export default Hero