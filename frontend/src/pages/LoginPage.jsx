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
    <div style={{ backgroundColor: '#0D0D0D', minHeight: '100vh', position: 'relative' }}>
      {/* Login Form Card - Left side */}
      <div className="absolute top-1/2 left-[5%] transform -translate-y-1/2">
        <div className="bg-white p-12 rounded-3xl w-[450px]">
          <h1 className="text-2xl font-medium mb-1 text-center">Log In to your Account</h1>
          <p className="text-gray-500 text-sm mb-12 text-center tracking-wider">WELCOME</p>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
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

            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-gray-600">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white rounded-2xl py-4 font-medium text-base mt-4"
            >
              CONTINUE
            </button>

            <div className="text-center mt-6">
              <span className="text-gray-600 text-sm">New User? </span>
              <Link to="/register" className="text-black font-semibold text-sm">
                SIGN UP HERE
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
            Project Manage Easily...
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