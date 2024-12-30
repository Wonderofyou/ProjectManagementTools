import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(part => part !== '');
  console.log(pathParts);

  // Kiểm tra nếu phần đầu của đường dẫn là 'account'
  const isCenter = pathParts.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full mb-4 p-6">
        <Header />
      </header>

      {isCenter ? (
        <div className="flex justify-center">
          <Outlet />
        </div>
      ) : (
        // Nếu không phải trang 'account', áp dụng bố cục 'flex-1'
        <div className="flex flex-1">
          <Outlet />
        </div>
      )}
    </div>
  );
}
