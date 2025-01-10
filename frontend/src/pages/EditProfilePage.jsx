import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [NotificationMessage, setNotificationMessage] = useState("");

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
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setError(null);
      setNotificationMessage(null);

      // Chuẩn bị dữ liệu để gửi
      const updateData = {
        name: profile.fullName,
        email: profile.email,
      };

      // Nếu người dùng nhập mật khẩu mới, thêm vào body
      if (newPassword && oldPassword) {
        updateData.password = newPassword;
        updateData.oldpassword = oldPassword;  // Truyền mật khẩu hiện tại
      }


      // Gọi API cập nhật profile
      await axios.post('/v1/user/edit-profile', updateData);
      setNotificationMessage('Profile updated successfully');
      setShowNotification(true)
      setPassword(''); // Reset lại mật khẩu sau khi đổi thành công
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Unknown error occurred";
      setNotificationMessage(errorMessage);
      setShowNotification(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      {/* Header */}
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl font-semibold">
            Welcome, {profile?.name || 'User'}
          </h1>
          <div className="text-sm text-gray-500">Tue, 07 June 2022</div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold">{profile?.name}</h2>
            <p className="text-gray-500">{profile?.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Input for Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={profile?.name || ''}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Input for Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="text"
              placeholder="Your Email"
              value={profile?.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mt-6">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? 'Cancel' : 'Change Password'}
          </button>

          {showChangePassword && (
            <div className="mt-4">
              <div>
                <label className="block text-sm font-medium">Old Password</label>
                <input
                  type="password"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
        {showNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 h-40 relative">
              <h3 className="text-lg font-semibold mb-4">{NotificationMessage}</h3>
              {/* Nút Cancel nằm ở góc phải dưới */}
              <div className="absolute bottom-4 right-4">
                <button
                  type="button"
                  onClick={() => setShowNotification(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={handleUpdateProfile}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfilePage;
