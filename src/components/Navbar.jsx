import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="flex justify-between items-center bg-[#72b8f0] text-[#222] px-8 py-4 min-h-[72px]">
    <div className="flex items-center gap-2">
      <img
        src="https://www.freeiconspng.com/thumbs/restroom-icon/man-and-women-restroom-icon-12.png"
        alt="Toilet Icon"
        className="w-10 h-10"
      />
      <span className="font-bold text-2xl text-[#222]">Where2Go</span>
    </div>
    <ul className="flex gap-8 text-lg font-medium">
      <li><Link to="/" className="hover:text-[#444]">Home</Link></li>
      <li><Link to="/about" className="hover:text-[#444]">About</Link></li>
      <li><Link to="/contact" className="hover:text-[#444]">Contact</Link></li>
    </ul>
  </nav>
);

export default Navbar;