import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");
      const storedUserName = localStorage.getItem("name");
      const storedUserEmail = localStorage.getItem("email");

      setIsLoggedIn(!!token);
      setRole(userRole);
      setUserName(storedUserName || "Guest User");
      setUserEmail(storedUserEmail || "No Email Provided");
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("auth-change", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("auth-change", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    setSuccess("Logout successful");

    setTimeout(() => {
      setIsLoggedIn(false);
      navigate("/login");
    }, 1500);
  };

  const roleDashboard = () => {
    if (role === "admin") {
      navigate("/AdminDashboard");
    } else if (role === "student") {
      navigate("/StudentDashboard");
    } else if (role === "faculty") {
      navigate("/FacultyDash");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">

      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">HDU</span>
        </a>
          
           <Link to="/exams">
           <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300  cursor-pointer">Exam</span>
           </Link>

           <Link to="/enroll-course">
           <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300  cursor-pointer">enroll</span>
           </Link>
           
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {isLoggedIn ? (
            <>
              <button 
                id="dropdownAvatarNameButton"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:me-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
                type="button"
              >
                <span className="sr-only">Open user menu</span>
                <img className="w-8 h-8 me-2 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="User Profile" />
                {userName}
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div id="dropdownAvatarName" className="absolute right-4 top-12 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div className="font-medium">{role?.toUpperCase()}</div>
                    <div className="truncate">{userEmail}</div>
                  </div>
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <button onClick={roleDashboard} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Profile
                      </Link>
                    </li>
                  </ul>
                  <div className="py-2">
                  {success && <p className="text-green-500 text-center ">{success}</p>}

                    <button onClick={handleLogout} className="block font-bold text-yellow-500 w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button className="block border-3 text-blue-700 w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
               <Link to="/login">Login</Link>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;