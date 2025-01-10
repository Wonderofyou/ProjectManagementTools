import { Link, useLocation } from "react-router-dom";

export default function AccountNav() {
  const { pathname } = useLocation();
  let subpage = pathname.split('/')?.[2];
  if (subpage === undefined) {
    subpage = 'profile';
  }

  function linkClasses(type = null) {
    let classes = 'inline-flex items-center gap-2 py-2 px-6 rounded-full text-lg font-medium transition-all duration-300 ease-in-out transform hover:scale-105';
    if (type === subpage) {
      classes += ' bg-blue-600 text-white shadow-lg hover:bg-blue-700';
    } else {
      classes += ' bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white';
    }
    return classes;
  }

  return (
    <nav className="w-full flex justify-center mt-8 gap-6 mb-8">
      {/* My Profile Link */}
      <Link className={linkClasses('profile')} to={'/account'}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        <span className="hidden md:block">My profile</span>
      </Link>

      {/* Edit Profile Link */}
      <Link className={linkClasses('edit')} to={'/edit-profile'}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
        <span className="hidden md:block">Edit my profile</span>
      </Link>

      {/* My Projects Link */}
      <Link className={linkClasses('projects')} to={'/projects'}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span className="hidden md:block">My projects</span>
      </Link>
    </nav>
  );
}
