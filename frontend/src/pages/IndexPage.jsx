import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import Introduction from "../Component/Introduction";
import HomepageImage from "../Component/HomepageImage";
import Sidebar from "../Component/Sidebar";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";

function IndexPage() {
  const { user, ready } = useContext(UserContext);

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex min-h-screen">
        <Sidebar className="fixed top-0 left-0 w-72 h-full" />
        <div className="ml-72 flex-1 p-4">
          <h1>Welcome, {user.name}!</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow relative">
        {/* chỉ cho phần content */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundColor: '#ffffff',
            backgroundImage: `
              radial-gradient(at 100% 0%, hsla(220, 60%, 98%, 1) 0px, transparent 50%),
              radial-gradient(at 0% 0%, hsla(220, 60%, 98%, 1) 0px, transparent 50%),
              radial-gradient(at 100% 100%, hsla(220, 60%, 98%, 1) 0px, transparent 50%),
              radial-gradient(at 0% 100%, hsla(220, 60%, 98%, 1) 0px, transparent 50%)
            `,
          }}
        />
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex flex-row items-center justify-between gap-8 py-20">
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