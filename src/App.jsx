import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Footer from './components/Footer'
import News from './components/News'

const App = () => {
  return (
    <div className="min-h-screen bg-white ">
      <Navbar />
      <div className="overflow-x-hidden">
        <Hero />
        <Services />
        <News />
        <Footer/>
      </div>
    </div>
  )
}

export default App