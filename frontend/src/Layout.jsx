import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <header className="w-full mb-4 p-6 px-20">
        <Header />
      </header>

      <div className="flex flex-1">
        <Outlet />
      </div>
    </div>
  );
}

