import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import  { useNavigate } from 'react-router-dom';


const Homepage = () => {

  const navigate = useNavigate()

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  // Repeating text animation
  const repeatingTextVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: [0, 1, 0],
      y: [20, 0, -20],
      transition: { duration: 2, repeat: Infinity, repeatDelay: 1 },
    },
  };

  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative text-center">
          <motion.h1
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl font-bold mb-4"
          >
            Welcome to CollegeSync
          </motion.h1>
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-xl mb-8"
          >
            Empowering education with modern technology.
          </motion.p>
          <motion.button
             onClick={() => navigate("/courses")}
            variants={textVariants}
             whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg"
          >
            Get Started with Courses
          </motion.button>
        </div>
      </motion.div>

      {/* About Section */}
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Students"
              className="rounded-lg shadow-lg"
            />
          </motion.div>
          <motion.div
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">About Our College</h2>
            <p className="text-gray-700 mb-6">
              We are dedicated to providing a world-class education with state-of-the-art facilities and a focus on innovation. Our students thrive in a supportive and dynamic environment.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-2 rounded-full"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Professional Pages Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">For Everyone</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '👩‍🏫',
                title: 'Faculty',
                description: 'Tools for professors to manage courses, grades, and student progress.',
                image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              },
              {
                icon: '🎓',
                title: 'Students',
                description: 'Access your courses, grades, and resources all in one place.',
                image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
              },
              {
                icon: '👨‍💼',
                title: 'Admin',
                description: 'Manage college operations, users, and system settings.',
                image: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-700 mb-6">{item.description}</p>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full"
                >
                  Learn More
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Repeating Text Animation Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
        <div className="container mx-auto text-center">
          <motion.h2
            variants={repeatingTextVariants}
            initial="initial"
            animate="animate"
            className="text-4xl font-bold text-white"
          >
            Join Us Today!
          </motion.h2>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Campus Life</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1364&q=80',
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
            'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          ].map((image, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-64 object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="mb-4">© 2023 CollegeSync. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-blue-400">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400">Terms of Service</a>
            <a href="#" className="hover:text-blue-400">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;