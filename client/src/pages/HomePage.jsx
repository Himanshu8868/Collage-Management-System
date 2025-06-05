import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import dashboard from '../assets/images/dashboard.jpeg'
import { FiArrowRight, FiCheckCircle, FiDatabase, FiClock, FiLayers, FiBarChart2, FiLock, FiUsers, FiBookOpen, FiAward } from 'react-icons/fi';

const Homepage = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const testimonialVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Stats data - use your actual metrics
  const stats = [
    { value: "50+", label: "Institutions Using Our System", icon: <FiDatabase className="text-2xl" /> },
    { value: "90%", label: "Process Automation", icon: <FiClock className="text-2xl" /> },
    { value: "10K+", label: "Daily Transactions", icon: <FiLayers className="text-2xl" /> },
    { value: "100%", label: "Data Security", icon: <FiLock className="text-2xl" /> },
  ];

  return (
    <div className="font-sans bg-gray-50 text-gray-900 overflow-x-hidden">
      {/* Floating Navigation Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </motion.button>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="grid grid-cols-4 gap-8 opacity-50">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-16 h-16 border-2 border-white/20 rounded-lg"></div>
            ))}
          </div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl">
          <motion.h1
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="text-blue-300">Campus</span>
            <span className="text-white">Pro </span>
            <span className="text-yellow-300">Management</span>
          </motion.h1>
          
          <motion.p
            variants={textVariants}
            className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
          >
             Geo-Location-Based Atttendace System
          </motion.p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              onClick={() => navigate("/demo")}
              variants={textVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg flex items-center gap-2"
            >
              <FiArrowRight />
            </motion.button>
            <motion.button
              onClick={() => navigate("/pricing")}
              variants={textVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold"
            >
                Visit
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Trusted By Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 mb-8">Trusted by leading institutions worldwide</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 font-medium">Logo {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="py-16 bg-gray-900 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="text-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="text-blue-400 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2 text-white">{stat.value}</h3>
                <p className="text-blue-200">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Campus Management</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All the tools you need to efficiently run your educational institution
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Student Information System",
                description: "Centralized database for all student records with advanced analytics",
                icon: <FiUsers className="text-4xl mb-4 text-blue-600" />
              },
              {
                title: "Attendance Tracking",
                description: "Automated attendance with Zeo-location based request",
                icon: <FiCheckCircle className="text-4xl mb-4 text-blue-600" />
              },
              {
                title: "Academic Scheduling",
                description: "Smart timetabling and room allocation system",
                icon: <FiClock className="text-4xl mb-4 text-blue-600" />
              },
              {
                title: "Examination System",
                description: "Complete exam management from scheduling to results",
                icon: <FiBookOpen className="text-4xl mb-4 text-blue-600" />
              },
              {
                title: "Fee Management",
                description: "Automated billing, payments, and financial reporting",
                icon: <FiBarChart2 className="text-4xl mb-4 text-blue-600" />
              },
              {
                title: "HR & Payroll",
                description: "Staff management with integrated payroll system",
                icon: <FiDatabase className="text-4xl mb-4 text-blue-600" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-gray-100"
              >
                {feature.icon}
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Preview Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Intuitive <span className="text-blue-600">Dashboard</span> for Every User
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Role-specific interfaces designed to simplify daily operations for administrators, faculty, and students.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Real-time analytics and reporting",
                  "Customizable admin views",
                  "Mobile-responsive design",
                  "Single sign-on integration"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <FiCheckCircle className="text-green-500 text-xl" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
              >
                See All Features
              </motion.button>
            </motion.div>
            
                    <motion.div
  initial={{ opacity: 0, x: 50 }}
  whileInView={{ opacity: 1, x: 0 }}
  className="order-1 lg:order-2 relative rounded-xl overflow-hidden shadow-2xl"
>
  {/* Fake browser top bar */}
  <div className="bg-gray-100 p-2 rounded-t-md flex space-x-2">
    <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
    <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span>
    <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
  </div>

  {/* Dashboard Image */}
  <img
    src={dashboard}
    alt="Admin Dashboard Preview"
    className="w-full h-96 object-cover"
  />

  {/* Hover effect */}
  <div className="absolute inset-0 border-4 border-transparent hover:border-blue-300/50 transition-all duration-300 pointer-events-none" />
</motion.div>

          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Hear from institutions that transformed their operations
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Reduced our administrative workload by 60% while improving data accuracy.",
                name: "Dr. Sarah Johnson",
                role: "Dean, Springfield University",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                quote: "The attendance automation alone saved us 20 hours per week in manual work.",
                name: "Michael Chen",
                role: "Registrar, Techwood College",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                quote: "Parent engagement increased dramatically after implementing the portal.",
                name: "Priya Patel",
                role: "Principal, Global Academy",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={testimonialVariants}
                initial="hidden"
                whileInView="visible"
                className="bg-white/10 p-8 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all"
              >
                <div className="text-xl italic mb-6">"{testimonial.quote}"</div>
                <div className="flex items-center gap-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-blue-200">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Modernize Your Campus?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join hundreds of institutions revolutionizing their management systems
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg"
              >
                Schedule a Demo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold"
              >
                Contact Our Team
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">CampusPro</h3>
              <p className="mb-4">The complete campus management solution for modern educational institutions.</p>
              <div className="flex gap-4">
                {['Twitter', 'Facebook', 'LinkedIn'].map((social) => (
                  <a key={social} href="#" className="hover:text-white">
                    {social}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Demo', 'Roadmap'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                {['Documentation', 'API', 'Help Center', 'Webinars'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                {['About Us', 'Careers', 'Contact', 'Partners'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} CampusPro Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;