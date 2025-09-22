// src/App.jsx
import { Link, Routes, Route } from 'react-router-dom'
import './App.css'
import Page1 from "./page/page1";
import Page2 from "./page/page2";

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/page1">Page1</Link> | <Link to="/page2">Page2</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h2>Welcome to Home</h2>} />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
      </Routes>
    </>
  )
}

export default App
