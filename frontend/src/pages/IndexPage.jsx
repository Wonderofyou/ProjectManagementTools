import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import { FaTasks, FaUsers, FaChartLine } from "react-icons/fa";  // Import các icon
import Introduction from "../Component/Introduction";
import HomepageImage from "../Component/HomepageImage";
import Sidebar from "../Component/Sidebar";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import Header from "../Header";

function IndexPage() {
  const { user, ready } = useContext(UserContext);

  if (!ready) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex min-h-screen bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-100">
        <Sidebar className="fixed top-0 left-0 w-72 h-full bg-gray-800" />
        <div className="ml-72 flex-1 p-6 flex justify-center items-center transform translate-x-[-15%] translate-y-[-10%]"> {/* Dịch lên trên một chút và trái một chút */}
          <div className="mt-8 max-w-3xl w-full">
            <h1 className="text-4xl font-bold text-center text-gray-800">Welcome, {user.name}!</h1>
            <p className="text-lg mt-2 text-center text-gray-600">Explore the features we offer!</p>
            <main className="mt-8 space-y-10">
              {/* Section giới thiệu trang web */}
              <section className="bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-semibold text-gray-800 text-center">Discover Our Features</h2>
                <p className="text-lg mt-2 text-center text-gray-600">A few highlights of what we offer to make your work easier.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 justify-center">
                  {/* Card 1 */}
                  <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300 ease-in-out h-full min-h-[300px]">
                    <FaTasks className="text-5xl mb-4 mx-auto" /> {/* Thêm icon */}
                    <h3 className="text-2xl font-semibold">Task Management</h3>
                    <p className="mt-2 text-sm">Create, assign, and track tasks effortlessly.</p>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300 ease-in-out h-full min-h-[300px]">
                    <FaUsers className="text-5xl mb-4 mx-auto" /> {/* Thêm icon */}
                    <h3 className="text-2xl font-semibold">Team Collaboration</h3>
                    <p className="mt-2 text-sm">Collaborate seamlessly with your team.</p>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300 ease-in-out h-full min-h-[300px]">
                    <FaChartLine className="text-5xl mb-4 mx-auto" /> {/* Thêm icon */}
                    <h3 className="text-2xl font-semibold">Analytics & Insights</h3>
                    <p className="mt-2 text-sm">Get real-time insights to optimize workflows.</p>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#ffffff",
            backgroundImage: ` 
              radial-gradient(at 100% 0%, hsla(220, 60%, 98%, 1) 0px, transparent 50%),
              radial-gradient(at 0% 0%, hsla(220, 60%, 98%, 1) 0px, transparent 50%),
              radial-gradient(at 100% 100%, hsla(220, 60%, 98%, 1) 0px, transparent 50%),
              radial-gradient(at 0% 100%, hsla(220, 60%, 98%, 1) 0px, transparent 50%)
            `,
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 transform translate-x-[5%] translate-y-[-5%]"> {/* Dịch sang trái và lên trên một chút */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <Introduction />
            <HomepageImage />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default IndexPage;
