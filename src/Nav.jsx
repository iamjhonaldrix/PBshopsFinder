import { Link, useLocation, useNavigate } from "react-router-dom";

function Navigator() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in
  const userId = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="navigator col-span-12 flex items-center justify-between p-4 bg-gray-900 text-white shadow-xl/40">
      
      <div className="text-4xl font-bold">
        <Link to="/">PulongBuhangin</Link>
      </div>

      <div className="hidden md:flex space-x-6">
        {!userId && (
          <>
            <Link to="/" className="hover:text-yellow-400 hover:scale-110">Home</Link>
            <Link to="/businesses" className="hover:text-yellow-400 hover:scale-110">Businesses</Link>
            <Link to="/categories" className="hover:text-yellow-400 hover:scale-110">See Categories</Link>
            <Link to="/about" className="hover:text-yellow-400 hover:scale-110">About</Link>
          </>
        )}

        {userId && (
          <>
            <Link to="/" className="hover:text-yellow-400 hover:scale-110">Home</Link>
            <Link to="/businesses" className="hover:text-yellow-400 hover:scale-110">Businesses</Link>
            <Link to="/see-post" className="hover:text-yellow-400 hover:scale-110">See Post</Link>
            <Link to="/data" className="hover:text-yellow-400 hover:scale-110">Data</Link>
            <Link to="/profile" className="hover:text-yellow-400 hover:scale-110">Profile</Link>
          </>
        )}
      </div>

      <div className="space-x-3">
        {!userId && (
          <>
            <Link to="/signup">
              <button className="transition bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 hover:scale-110 font-semibold">
                Signup
              </button>
            </Link>
            <Link to="/login">
              <button className="transition bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 hover:scale-110 font-semibold">
                Login
              </button>
            </Link>
          </>
        )}
        {userId && (
          <>
          <Link to="/dashboard" className="transition bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 font-semibold">Dashboard</Link>
          <button
            onClick={handleLogout}
            className="transition bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 hover:scale-110 font-semibold">
            Logout
          </button>
          </>
        )
        
        }
        
      </div>
    </div>
  );
}

export default Navigator;