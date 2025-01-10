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
    <div className="bg-gray-800 min-h-screen flex items-center justify-between px-10">
      {/* Registration Form Card */}
      <div className="bg-white rounded-3xl shadow-lg w-full sm:w-[500px] p-10">
        <h1 className="text-3xl font-semibold text-center mb-4 text-gray-800">Create an Account</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">WELCOME</p>

        <form onSubmit={registerUser} className="space-y-6">
          {/* Name input */}
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={ev => setName(ev.target.value)}
              className="w-full px-6 py-4 bg-gray-100 rounded-xl focus:outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={ev => setEmail(ev.target.value)}
              className="w-full px-6 py-4 bg-gray-100 rounded-xl focus:outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password input */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={ev => setPassword(ev.target.value)}
              className="w-full px-6 py-4 bg-gray-100 rounded-xl focus:outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Register button */}
          <button
            type="submit"
            className="w-full bg-blue-400 text-white rounded-2xl py-4 font-medium text-base mt-4 hover:bg-blue-500 transition"
          >
            REGISTER
          </button>

          {/* Login link */}
          <div className="text-center mt-6">
            <span className="text-gray-600 text-sm">Already a member? </span>
            <Link to="/login" className="text-blue-500 font-semibold text-sm">
              LOGIN HERE
            </Link>
          </div>
        </form>
      </div>

      {/* Right side - Logo and Slogan */}
      <div className="hidden lg:block w-full lg:w-[40%]">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="flex items-center mb-6">
            <Label className="w-[60px]" />
            <div className="ml-4">
              <span className="text-[#FFA500] text-4xl font-light">PMTools</span>
              <p className="text-gray-400 text-sm mt-2">Intelligent Project Management Tool</p>
            </div>
          </div>

          <div>
            <h2 className="text-white text-4xl font-light">Start Managing Your Projects...</h2>
            <div className="flex justify-center gap-6 mt-8">
              <div className="w-16 h-[2px] bg-white rounded-full"></div>
              <div className="w-16 h-[2px] bg-gray-600 rounded-full"></div>
              <div className="w-16 h-[2px] bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
