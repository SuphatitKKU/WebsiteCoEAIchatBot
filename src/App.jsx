import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatButton from './components/ChatButton'

import Hero from './components/Hero'
import News from './components/News'
import Services from './components/Services'

import Admission from './pages/Admission'
import Course from './pages/Course'
import Activity from './pages/Activity'
import Contact from './pages/Contact'
import Feedback from './pages/Feedback'
import AdminDashboard from './pages/AdminDashboard'

const DefaultLayout = ({ children }) => (
  <div className="min-h-screen bg-white">
    <Navbar />
    {children}
    <Footer />
    <ChatButton />
  </div>
)

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-white">
    {children}
  </div>
)

const HomePage = () => (
  <div className="overflow-x-hidden">
    <Hero />
    <Services />
    <News />
  </div>
)

const NotFound = () => (
  <div className="min-h-screen p-4">
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600">ไม่พบหน้าที่คุณค้นหา</p>
      </div>
    </div>
  </div>
)

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout><HomePage /></DefaultLayout>} />
        <Route path="/admission" element={<DefaultLayout><Admission /></DefaultLayout>} />
        <Route path="/course" element={<DefaultLayout><Course /></DefaultLayout>} />
        <Route path="/activity" element={<DefaultLayout><Activity /></DefaultLayout>} />
        <Route path="/contact" element={<DefaultLayout><Contact /></DefaultLayout>} />
        <Route path="/feedback" element={<DefaultLayout><Feedback /></DefaultLayout>} />
        <Route path="/AdminDashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="*" element={<DefaultLayout><NotFound /></DefaultLayout>} />
      </Routes>
    </Router>
  )
}

export default App
