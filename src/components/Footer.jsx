import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import assets from '../assets/assets'; // Assuming 'assets' contains your logo

const Footer = () => {
  return (
    <>
      <style>
        {`
          @media (min-width: 1600px) {
            .footer-desktop {
              margin-top: -120px;
            }
          }
        `}
      </style>

      <footer className="bg-gray-100 py-6 px-4 mt-10 footer-desktop">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">
          {/* Left Section */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <img src={assets.logo} alt="โลโก้มหาวิทยาลัยขอนแก่น" className='w-32 sm:w-40 relative z-10'/>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              แหล่งรวมข้อมูลและความรู้ด้านวิศวกรรมคอมพิวเตอร์และวิศวกรรมสื่อดิจิตอล 
              มหาวิทยาลัยขอนแก่น เพื่อการเรียนรู้และพัฒนาในยุคเทคโนโลยี
            </p>
            <nav className="flex space-x-4">
              <a href="#" className="text-gray-700 hover:text-blue-600 text-sm transition-colors">
                หน้าแรก
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 text-sm transition-colors">
                หลักสูตร
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 text-sm transition-colors">
                ผลงาน
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 text-sm transition-colors">
                ติดต่อเรา
              </a>
            </nav>
          </div>

          {/* Right Section */}
          <div className="col-span-1 flex flex-col items-start">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ติดตามข่าวสาร
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              ติดตามเราในโซเชียลมีเดียเพื่อรับข้อมูลข่าวสารและความรู้ใหม่ๆ 
              ด้านเทคโนโลยีและวิศวกรรม
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-600 text-gray-600 transition-colors">
                <FaFacebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        {/* Bottom Section - Copyright */}
        <div className="max-w-7xl mx-auto flex justify-center text-sm text-gray-600">
          <p>
            ลิขสิทธิ์ 2568 © วิศวกรรมคอมพิวเตอร์และสื่อดิจิตอล มหาวิทยาลัยขอนแก่น - สงวนสิทธิ์ทุกประการ
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
