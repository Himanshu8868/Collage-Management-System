import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { FaSun, FaMoon, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggleButton = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <motion.div 
      className="my-10 px-8 py-8 rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-all duration-500 border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white flex items-center gap-3">
            <FaInfoCircle className="text-blue-500" />
            Theme Preferences
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
            Customize your viewing experience with our theme options. The system automatically adjusts
            based on your device preferences, or you can manually select your preferred mode below.
          </p>
        </div>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-sm font-medium"
        >
          {showInfo ? 'Hide details' : 'Learn more'}
        </button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">About Theme Options</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                <li>• Light mode reduces eye strain in bright environments</li>
                <li>• Dark mode conserves battery on OLED displays</li>
                <li>• System preference follows your OS settings</li>
                <li>• Your selection is saved for future visits</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-full transition duration-300 ${
            darkMode 
              ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {darkMode ? (
            <>
              <FaSun className="text-xl" />
              Switch to Light Mode
            </>
          ) : (
            <>
              <FaMoon className="text-xl" />
              Switch to Dark Mode
            </>
          )}
        </motion.button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Current mode: <span className="font-medium">{darkMode ? 'Dark' : 'Light'}</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Accessibility Features</h4>
        <div className="flex flex-wrap gap-3">
          <button className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            Increase Contrast
          </button>
          <button className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            Larger Text
          </button>
          <button className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            Reduce Motion
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ThemeToggleButton;