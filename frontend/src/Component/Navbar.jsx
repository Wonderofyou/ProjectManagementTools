import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="py-4 px-6 absolute top-0 right-12"> {/* right 12 */}
            <div className="flex items-center space-x-6">
                <Link to="/login">
                    <button className="px-12 py-4 text-lg bg-yellow-100 rounded-xl hover:bg-yellow-200 transition-colors">
                        Login
                    </button>
                </Link>
                <Link to="/register">
                    <button className="px-14 py-4 text-lg bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                        Try PMTools free →
                    </button>
                </Link>
            </div>
        </nav>
    )
}