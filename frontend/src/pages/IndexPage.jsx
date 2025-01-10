import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import Introduction from "../Component/Introduction";
import HomepageImage from "../Component/HomepageImage";
import Sidebar from "../Component/Sidebar";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import Header  from "../Header";

function IndexPage() {
  const { user, ready } = useContext(UserContext);

  if (!ready) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="fixed top-0 left-0 w-72 h-full bg-gray-800" />
        <div className="ml-72 flex-1 p-6">
          <div className="mt-8">
            <h1 className="text-3xl font-semibold text-gray-800">Welcome, {user.name}!</h1>
            <main className="mt-8">
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
            `,}}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
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
