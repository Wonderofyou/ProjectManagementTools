import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.jsx";
import Label from "../Icon/Label.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post('v1/auth/login', { email, password });
      setUser(data);
      setRedirect(true);
    } catch (e) {
      alert('Login failed');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-between px-10">
      {/* Login Form Card */}
      <div className="bg-white rounded-3xl shadow-lg w-full sm:w-[500px] p-10">
        <h1 className="text-3xl font-semibold text-center mb-4 text-gray-800">Log In</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Welcome back to your account</p>

        <form onSubmit={handleLoginSubmit} className="space-y-6">
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

          {/* Remember me and forgot password */}
          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
              Forgot Password?
            </Link>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-blue-400 text-white rounded-2xl py-4 font-medium text-base mt-4 hover:bg-blue-500 transition"
          >
            CONTINUE
          </button>

          {/* Sign up link */}
          <div className="text-center mt-6">
            <span className="text-gray-600 text-sm">New User? </span>
            <Link to="/register" className="text-blue-500 font-semibold text-sm">
              SIGN UP HERE
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
            <h2 className="text-white text-4xl font-light">Manage Your Projects Like a Pro</h2>
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
