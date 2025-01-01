import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Label from "../Icon/Label.jsx";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function registerUser(ev) {
    ev.preventDefault();
    try {
      await axios.post('v1/auth/register', {
        name,
        email,
        password,
      });
      alert('Registration successful. Now you can log in');
    } catch (e) {
      alert('Registration failed. Please try again later');
    }
  }

  return (
    <div style={{ backgroundColor: '#0D0D0D', minHeight: '100vh', position: 'relative' }}>
      {/* Registration Form Card - Left side */}
      <div className="absolute top-1/2 left-[5%] transform -translate-y-1/2">
        <div className="bg-white p-12 rounded-3xl w-[450px]">
          <h1 className="text-2xl font-medium mb-1 text-center">Create an Account</h1>
          <p className="text-gray-500 text-sm mb-12 text-center tracking-wider">WELCOME</p>

          <form onSubmit={registerUser} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={ev => setName(ev.target.value)}
                className="w-full px-6 py-4 bg-gray-50 rounded-xl focus:outline-none border border-gray-100"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={ev => setEmail(ev.target.value)}
                className="w-full px-6 py-4 bg-gray-50 rounded-xl focus:outline-none border border-gray-100"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                className="w-full px-6 py-4 bg-gray-50 rounded-xl focus:outline-none border border-gray-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white rounded-2xl py-4 font-medium text-base mt-4"
            >
              REGISTER
            </button>

            <div className="text-center mt-6">
              <span className="text-gray-600 text-sm">Already a member? </span>
              <Link to="/login" className="text-black font-semibold text-sm">
                LOGIN HERE
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Logo and content - Right side */}
      <div className="absolute top-1/2 right-[5%] transform -translate-y-1/2">
        <div className="flex items-center mb-4">
          <Label className="w-[60px]" />
          <div className="ml-4">
            <span className="text-[#FFA500] text-4xl font-light tracking-wider">PMTOOLs</span>
            <p className="text-gray-400 text-sm mt-2">Intelligent Project Management Tool</p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-white text-4xl font-light">
            Start Managing Your Projects...
          </h2>
          <div className="flex gap-4 mt-8">
            <div className="w-16 h-[2px] bg-white rounded-full"></div>
            <div className="w-16 h-[2px] bg-gray-800 rounded-full"></div>
            <div className="w-16 h-[2px] bg-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}