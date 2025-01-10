import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [NotificationMessage, setNotificationMessage] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [avatar, setAvatar] = useState(null); // State to hold the avatar image

  // Các state cho Phone và Address
  const [phone, setPhone] = useState("0395676315"); // Default phone value
  const [address, setAddress] = useState("227 Nguyễn văn Cừ"); // Default address value

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/v1/auth/profile'); // Gọi API lấy profile
        setProfile(response.data); // Giả sử response.data chứa thông tin profile
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Lấy ngày hiện tại
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Update the avatar preview with the selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Save the image as a base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = () => {
    // Không gửi API nữa, chỉ thay đổi thông tin trên UI
    setNotificationMessage('Profile updated successfully');
    setShowNotification(true)
    setOldPassword('');
    setNewPassword('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-indigo-100 to-blue-200 min-h-screen">
      {/* Header */}
      <div className="w-full max-w-full bg-white shadow-xl rounded-lg mb-8 mx-auto">
        <div className="flex justify-between items-center py-6 px-10 border-b-2 border-gray-200">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Welcome, {profile?.name || 'User'}
            </h1>
            <div className="text-sm text-gray-600 mt-2">
              {currentDate}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-10 mx-auto">
        <div className="flex items-center justify-between mb-6">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            {/* Avatar hình tròn, clickable */}
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                {/* Avatar Image, fallback to placeholder if no avatar */}
                <img
                  src={avatar || 'https://via.placeholder.com/100/ff5733/ffffff?text=AB'} // Default or selected image
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }} // Hide the file input
            />
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Input for Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={profile?.name || ''}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Input for Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={phone} // Giá trị từ state phone
              onChange={(e) => setPhone(e.target.value)} // Cập nhật state phone khi người dùng nhập
              className="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Input for Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={address} // Giá trị từ state address
              onChange={(e) => setAddress(e.target.value)} // Cập nhật state address khi người dùng nhập
              className="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mt-8">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? 'Cancel' : 'Change Password'}
          </button>

          {showChangePassword && (
            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Old Password</label>
                <input
                  type="password"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Notification */}
        {showNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 h-40 relative shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{NotificationMessage}</h3>
              <div className="absolute bottom-4 right-4">
                <button
                  type="button"
                  onClick={() => setShowNotification(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="mt-8 flex justify-center">
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={handleUpdateProfile}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
