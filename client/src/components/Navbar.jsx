import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios"
import { FiUser, FiLogOut, FiSettings, FiHome, FiBook, FiLogIn } from "react-icons/fi";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");
      const storedUserName = localStorage.getItem("name");

      setIsLoggedIn(!!token);
      setRole(userRole);
      setUserName(storedUserName || "Guest");
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    checkLoginStatus();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    navigate("/");
  };

  const roleDashboard = () => {
    if (role === "admin") navigate("/AdminDashboard");
    else if (role === "student") navigate("/StudentDashboard");
    else if (role === "faculty") navigate("/faculty-portal");
    
  };

  const LoginModal = ({ closeModal }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", { 
          email, 
          password 
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("email", response.data.email);

        setIsLoggedIn(true);
        closeModal();
        if (role === "admin") navigate("/AdminDashboard");
    else if (role === "student") navigate("/StudentDashboard");
    else if (role === "faculty") navigate("/faculty-portal");
      } catch (err) {
           if(err){
            toast.error("incorrect username or password");
           }
        setError(err.response?.data?.error || 'Login failed. Please try again.');
        setIsLoading(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={closeModal}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>

          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FiUser className="text-blue-600 dark:text-blue-400 text-2xl" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Welcome Back
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                  required
                />
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    <FiLogIn />
                    Sign In
                  </>
                )}
              </motion.button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/register-page" 
                onClick={closeModal}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <>
      <nav className={`fixed  w-full  top-0 z-40 transition-all duration-500 ${scrolled ? 'backdrop-blur-md bg-white/30 dark:bg-gray-900/30 shadow-sm' : 'backdrop-blur-sm bg-white/20 dark:bg-gray-900/20'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and main nav */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Menu"
              >
                <div className="w-6 flex flex-col items-center justify-center space-y-1.5">
                  <span className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>

              <Link to="/" className=" flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src="https://flowbite.com/docs/images/logo.svg" alt="Logo" />
                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white py-6">HDU</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/30">
                    <FiHome className="mr-2" /> Home
                  </Link>
                  <Link to="/exams" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/30">
                    <FiBook className="mr-2" /> Exams
                  </Link>
                  <Link to="/enroll-course" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/30">
                    <FiBook className="mr-2" /> Enroll
                  </Link>
                </div>
              </div>
            </div>

            {/* User actions */}
            <div className="flex items-center">
              {isLoggedIn ? (
                <div className="relative ml-4">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img className="h-8 w-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="User" />
                    <span className="ml-2 text-gray-900 dark:text-white font-medium hidden md:inline">{userName}</span>
                    <svg className={`ml-1 h-4 w-4 text-gray-900 dark:text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{role?.toUpperCase()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userName}</p>
                      </div>
                      <button 
                        onClick={roleDashboard}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <FiHome className="mr-2" /> Dashboard
                      </button>
                      <Link 
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <FiUser className="mr-2" /> Profile
                      </Link>
                      <Link 
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <FiSettings className="mr-2" /> Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <FiLogOut className="mr-2" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex  space-x-2">
                  <motion.button
                    onClick={() => setIsLoginModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FiLogIn className="mr-2" /> Login
                  </motion.button>
                  <Link 
                    to="/register-page"
                    className="px-4 py-2 rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/30 flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiHome className="mr-2" /> Home
            </Link>
            <Link 
              to="/exams" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/30 flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiBook className="mr-2" /> Exams
            </Link>
            <Link 
              to="/enroll-course" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/30 flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiBook className="mr-2" /> Enroll
            </Link>
            
            {isLoggedIn ? (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => {
                    roleDashboard();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/30 flex items-center"
                >
                  <FiHome className="mr-2" /> Dashboard
                </button>
                <Link 
                  to="/profile"
                  className="block w-full px-4 py-2 text-left rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/30 flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUser className="mr-2" /> Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-white/20 dark:hover:bg-gray-800/30 flex items-center"
                >
                  <FiLogOut className="mr-2" /> Sign out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
               
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <LoginModal closeModal={() => setIsLoginModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;