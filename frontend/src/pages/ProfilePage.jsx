import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

import AccountNav from "../AccountNav";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  
  if (subpage === undefined) {
    subpage = 'profile';
  }

  // Logout function
  async function logout() {
    await axios.post('v1/auth/logout');
    setRedirect('/');
    setUser(null);
  }

  // Format date to dd/mm/yyyy
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
  };

  // If data is not ready
  if (!ready) {
    return 'Loading...';
  }

  // If user is not logged in and there is no redirect
  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />;
  }

  // If redirect is set
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AccountNav />

      {subpage === 'profile' && (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Profile Information</h2>

          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-lg text-gray-700">Logged in as <span className="font-semibold text-blue-600">{user.name}</span> ({user.email})</p>
              <p className="text-sm text-gray-500">Joined on: <span className="font-semibold">{'01/09/2025'}</span></p>
            </div>

            <button 
              onClick={logout} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </div>

          <div className="border-t mt-6 pt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h3>
            {/* You can add additional profile settings here */}
          </div>
        </div>
      )}
      
      {/* You can add other subpages like 'places' here */}
      {/* {subpage === 'places' && <PlacesPage />} */}
    </div>
  );
}
