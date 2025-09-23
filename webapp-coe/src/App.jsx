// src/App.jsx
import { Link, Routes, Route } from 'react-router-dom'
import './App.css'
import Admission from "./page/admission";
import Navbar from "./component/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<h2>Welcome to Home</h2>} />
        <Route path="/admission" element={<Admission/>} />
      </Routes>
    </>
  )
}

export default App
