import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatButton from './components/ChatButton'

// Import components หน้าหลัก
import Hero from './components/Hero'
import News from './components/News'
import Services from './components/Services'

// Import หน้าต่างๆ
import Admission from './pages/Admission'
import Course from './pages/Course'
import Activity from './pages/Activity'
import Contact from './pages/Contact'
import Feedback from './pages/Feedback'
import AdminDashboard from './pages/AdminDashboard'

// Layout ที่ใช้กับทุกหน้าทั่วไป
const DefaultLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {children}
      <Footer />
      <ChatButton />
    </div>
  )
}

// Layout สำหรับหน้า Admin (ไม่มี Navbar, Footer)
const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  )
}

// Home Page Component
const HomePage = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Services />
      <News />
    </div>
  )
}

// NotFound Component
const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600">ไม่พบหน้าที่คุณค้นหา</p>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ใช้ DefaultLayout */}
        <Route path="/" element={<DefaultLayout><HomePage /></DefaultLayout>} />
        <Route path="/admission" element={<DefaultLayout><Admission /></DefaultLayout>} />
        <Route path="/course" element={<DefaultLayout><Course /></DefaultLayout>} />
        <Route path="/activity" element={<DefaultLayout><Activity /></DefaultLayout>} />
        <Route path="/contact" element={<DefaultLayout><Contact /></DefaultLayout>} />
        <Route path="/feedback" element={<DefaultLayout><Feedback /></DefaultLayout>} />

        {/* ใช้ AdminLayout (ไม่มี Navbar, Footer) */}
        <Route path="/AdminDashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />

        {/* 404 */}
        <Route path="*" element={<DefaultLayout><NotFound /></DefaultLayout>} />
      </Routes>
    </Router>
  )
}

export default App
