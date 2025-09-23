import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="nb">
      <ul className="nb-menu">
        <li><NavLink end to="/" className={({isActive}) => isActive ? "nb-link active" : "nb-link"}>หน้าแรก</NavLink></li>
        <li><NavLink to="/about" className={({isActive}) => isActive ? "nb-link active" : "nb-link"}>เกี่ยวกับสาขา</NavLink></li>
        <li><NavLink to="/admission" className={({isActive}) => isActive ? "nb-link active" : "nb-link"}>Admission</NavLink></li>
        <li><NavLink to="/curriculum" className={({isActive}) => isActive ? "nb-link active" : "nb-link"}>ข้อมูลหลักสูตร</NavLink></li>
        <li><NavLink to="/activities" className={({isActive}) => isActive ? "nb-link active" : "nb-link"}>แนะแนว&กิจกรรม</NavLink></li>
        <li><NavLink to="/contact" className={({isActive}) => isActive ? "nb-link active" : "nb-link"}>Contact&Feedback</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;