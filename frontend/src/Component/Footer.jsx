import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#1a1f2e] text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 mb-6">
          <h3 className="text-lg font-semibold text-center">Contact Us</h3>
          <h3 className="text-lg font-semibold text-center">About</h3>
          <h3 className="text-lg font-semibold text-center">Subscribe</h3>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="ml-2 text-gray-300">227 Nguyen Van Cu, HCMC</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="ml-2 text-gray-300">support@figma.com</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="ml-2 text-gray-300">+84 123 456 789</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <a href="#" className="text-gray-300 hover:text-white text-sm">Features</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm">Pricing</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm">Gallery</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm">Team</a>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex w-full max-w-md">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-4 py-2 rounded-l bg-white text-gray-800 focus:outline-none"
              />
              <button className="px-6 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600">
                Subscribe
              </button>
            </div>
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold">Follow us</p>
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.225-.148-4.77-1.664-4.919-4.919-.058-1.264-.069-1.645-.069-4.849 0-3.204.012-3.584.069-4.849.149-3.228 1.664-4.771 4.919-4.919 1.265-.058 1.645-.07 4.849-.07zM12 0c-3.168 0-4.115.01-5.34.07-3.601.145-5.973 2.516-6.117 6.117-.06 1.225-.07 2.187-.07 5.34 0 3.168.01 4.115.07 5.34.145 3.601 2.516 5.973 6.117 6.117 1.225.06 2.187.07 5.34.07 3.168 0 4.115-.01 5.34-.07 3.601-.145 5.973-2.516 6.117-6.117.06-1.225.07-2.187.07-5.34 0-3.168-.01-4.115-.07-5.34-.145-3.601-2.516-5.973-6.117-6.117-1.225-.06-2.172-.07-5.34-.07z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-300 mt-6">
          &copy; 2025 PMTools, All rights reserved.
        </p>
      </div>
    </footer>
  );
}
