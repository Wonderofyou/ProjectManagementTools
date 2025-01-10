import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-[#1a1f2e] z-10 shadow-md py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/Icon/Label.svg"  // Đường dẫn đến file logo của bạn
              alt="Logo"
              className="h-8"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/login">
            <button className="px-12 py-4 text-lg bg-yellow-100 rounded-xl hover:bg-yellow-200 transition-colors">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-14 py-4 text-lg bg-blue-400 text-black-600 rounded-xl hover:bg-blue-200 transition-colors">
              Try PMTools free →
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
