import React from 'react';
import { FiTwitter, FiFacebook, FiLinkedin, FiGithub, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">
              Campus<span className="text-blue-500">Pro</span>
            </h3>
            <p className="text-sm leading-relaxed">
              Complete campus management solution for modern educational institutions.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white hover:underline transition">About Us</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Features</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white hover:underline transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FiMail className="text-blue-500 text-sm" />
                <a href="mailto:hello@campuspro.com" className="hover:text-white transition">hello@campuspro.com</a>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-blue-500 text-sm" />
                <a href="tel:+15551234567" className="hover:text-white transition">+1 (555) 123-4567</a>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin className="text-blue-500 text-sm mt-0.5" />
                <span>123 Education St, Tech Valley, CA 94025</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} CampusPro. All rights reserved.</p>
          
          {/* Social Links */}
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">
              <FiTwitter size={18} />
            </a>
            <a href="#" className="hover:text-white transition">
              <FiFacebook size={18} />
            </a>
            <a href="#" className="hover:text-white transition">
              <FiLinkedin size={18} />
            </a>
            <a href="#" className="hover:text-white transition">
              <FiGithub size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;