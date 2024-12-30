import React, { useContext } from "react";
import { UserContext } from "../UserContext"; // Import UserContext
import Introduction from "../Component/Introduction";
import HomepageImage from "../Component/HomepageImage";
import Sidebar from "../Component/Sidebar";
function IndexPage() {
  // Sử dụng UserContext để lấy thông tin người dùng và trạng thái sẵn sàng
  const { user, ready } = useContext(UserContext);

  // Nếu chưa có thông tin người dùng và chưa tải xong, hiển thị loading
  if (!ready) {
    return <div>Loading...</div>;
  }

  // Nếu người dùng đã đăng nhập, hiển thị giao diện dành cho người dùng
  if (user) {
    return (
      <div className="flex min-h-screen">
        {/* Sidebar cố định */}
        <Sidebar className="fixed top-0 left-0 bg-[#0e0e0e] w-72 h-full" />

        {/* Nội dung chính có khoảng cách từ Sidebar */}
        <div className="ml-72 flex-1 p-4">
          <h1>Chào mừng, {user.name}!</h1>
          <p>Bạn đã đăng nhập thành công. Code gì đó nè.</p>
          {/* Các thành phần khác dành cho người dùng đã đăng nhập */}
        </div>
      </div>
    );
  } else {
    // Nếu chưa đăng nhập, hiển thị giao diện yêu cầu đăng nhập
    return (
      <div className="flex">
        <Introduction />
        <HomepageImage />
      </div>

    );
  }
}

export default IndexPage;
