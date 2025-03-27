import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiAward, FiUsers, FiBookOpen } from 'react-icons/fi';
import video from '../assets/video/homepage.mp4'

const Homepage = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

  // Stats data
  const stats = [
    { value: "10K+", label: "Students Enrolled", icon: <FiUsers className="text-2xl" /> },
    { value: "500+", label: "Courses Offered", icon: <FiBookOpen className="text-2xl" /> },
    { value: "200+", label: "Expert Faculty", icon: <FiAward className="text-2xl" /> },
    { value: "98%", label: "Satisfaction Rate", icon: <FiCheckCircle className="text-2xl" /> },
  ];

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

      {/* Hero Section with Video Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
        </div>
        
        <div className="relative z-20 text-left px-4 max-w-4xl">
          <motion.h1
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl font-bold mb-6"
          >
             <span className='text-pink-400'>Welcome to </span><span className="text-blue-400">College Management <span className='text-pink-400'>Systsm</span></span>
          </motion.h1>
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl mb-8 text-dark-500"
          >
            Revolutionizing education through innovative technology and collaborative learning
          </motion.p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              onClick={() => navigate("/courses")}
              variants={textVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg flex items-center justify-center gap-2 hover:text--500"
            >
              Explore Courses <FiArrowRight />
            </motion.button>
            <motion.button
              onClick={() => navigate("/register")}
              variants={textVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold shadow-lg"
            >
              Join Now
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="py-16 bg-black"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white shadow-sm  "
              >
                <div className="text-blue-600 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2 hover:text-green-600">{stat.value}</h3>
                <p className="text-gray-600 hover:text-pink-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* About Section with Parallax Effect */}
      <div className="relative py-28 overflow-hidden ">
        <div className="absolute inset-0 bg-black  z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <video    
         autoPlay
          loop
          muted
          playsInline
                src="https://videos.pexels.com/video-files/7945680/7945680-hd_1920_1080_25fps.mp4"
                alt="Students"
                className="rounded-xl shadow-2xl w-full"
             ></video>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-lg max-w-xs"
              >
                <h4 className="font-bold text-lg mb-2">Since 1995</h4>
                <p className="text-gray-600">Providing quality education for over 25 years</p>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Transforming <span className="text-blue-600 hover:text-yellow-500">Education</span> <span className='text-green-500 hover:text-pink-500'>Through Innovation</span> 
              </h2>
              <p className="text-gray-700 mb-6 text-white hover:text-green-500">
                Our institution is dedicated to creating an environment where students don't just learn, but thrive. With cutting-edge facilities and a forward-thinking curriculum, we prepare students for the challenges of tomorrow.
              </p>
              <div className="space-y-4 mb-8 text-white hover:text-blue-600">
                {[
                  "World-class faculty with industry experience",
                  "State-of-the-art learning facilities",
                  "Industry-aligned curriculum",
                  "Global partnership opportunities"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <FiCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg flex items-center gap-2"
              >
                Discover Our Story <FiArrowRight />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CollegeSync?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We combine academic excellence with practical skills to create well-rounded professionals
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 hover:text-green-500">
            {[
              {
                title: "Interactive Learning",
                description: "Engaging digital platforms that make learning dynamic and effective",
                icon: "💻"
              },
              {
                title: "Career Support",
                description: "Dedicated career services to help you land your dream job",
                icon: "👔"
              },
              {
                title: "Global Network",
                description: "Connect with alumni and professionals worldwide",
                icon: "🌎"
              },
              {
                title: "Flexible Scheduling",
                description: "Programs designed to fit your busy lifestyle",
                icon: "⏱️"
              },
              {
                title: "Research Opportunities",
                description: "Work with faculty on cutting-edge research projects",
                icon: "🔬"
              },
              {
                title: "Campus Life",
                description: "Vibrant student community with diverse activities",
                icon: "🎉"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-blue-100 max-w-2xl mx-auto text-lg">
              Hear from our community about their experiences
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "CollegeSync provided me with the skills and network to launch my career successfully.",
                name: "Sarah Johnson",
                role: "Computer Science Graduate",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                quote: "The faculty's dedication and the practical curriculum set CollegeSync apart from others.",
                name: "Michael Chen",
                role: "Business Administration",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                quote: "I found my passion through the diverse courses and extracurricular activities offered.",
                name: "Priya Patel",
                role: "Art & Design",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={testimonialVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white/10 p-8 rounded-xl backdrop-blur-sm"
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
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Future?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join thousands of students who have already taken the first step toward their dream careers
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                onClick={() => navigate("/register")}
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg"
              >
                Apply Now
              </motion.button>
              <motion.button
                onClick={() => navigate("/contact")}
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold"
              >
                Contact Admissions
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;