import React from 'react';
import { Link } from 'react-router-dom';
import {FaFacebook, FaTwitter,FaInstagram  ,FaPhoneSquareAlt ,FaGithub, FaLinkedin} from 'react-icons/fa';
import { FiMapPin } from "react-icons/fi";
import { MdEmail } from "react-icons/md";


  import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-purple-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <motion.div 
            className="col-span-1 md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="text-2xl font-bold flex items-center gap-2 mb-4">
              <span className="text-3xl">🌎</span>
              <span>LocalExplorer</span>
            </Link>
            <p className="text-purple-200 mb-6">
              Connect with fellow travelers and locals for authentic experiences and adventures.
            </p>
            <div className="flex gap-4">
              <Link to="https://github.com/dinemo-lab" target="_blank"  className='text-purle-200 hover:text-white transition'>
                <FaGithub size={20}/>
              </Link>
              <Link to="https://www.linkedin.com/in/dineshmaurya12/" target='blank' className="text-purple-200 hover:text-white transition">
                <FaLinkedin size={20} />
              </Link>
              
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 border-b border-purple-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-purple-200 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/explore" className="text-purple-200 hover:text-white transition">Explore Visits</Link>
              </li>
              <li>
                <Link to="/create-visit" className="text-purple-200 hover:text-white transition">Create a Visit</Link>
              </li>
              <li>
                <Link to="/about" className="text-purple-200 hover:text-white transition">About Us</Link>
              </li>
              
            </ul>
          </motion.div>
          
          {/* Support */}
          <motion.div 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 border-b border-purple-700 pb-2">Support</h3>
            <ul className="space-y-2">
              
               
              {/* <li>
                <Link to="/terms" className="text-purple-200 hover:text-white transition">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-purple-200 hover:text-white transition">Privacy Policy</Link>
              </li> */}
              <li>
                <Link to="/contact" className="text-purple-200 hover:text-white transition">Contact Us</Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 border-b border-purple-700 pb-2">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin size={18} className="text-purple-300 mt-1 flex-shrink-0" />
                <span className="text-purple-200">Delhi</span>
              </li>
              {/* <li className="flex items-center gap-3">
                <FaPhoneSquareAlt size={18} className="text-purple-300 flex-shrink-0" />
                <span className="text-purple-200"></span>
              </li> */}
              <li className="flex items-center gap-3">
                <MdEmail size={18} className="text-purple-300 flex-shrink-0" />
                <a href="mailto:dineshmourya02@gmail.com" className="text-purple-200 hover:text-white transition">hello@dinesh.com</a>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-purple-950 py-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-purple-300">
          <p>© {new Date().getFullYear()} LocalExplorer. All rights reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            {/* <Link to="/cookies" className="hover:text-white transition">Cookies</Link>
            <Link to="/sitemap" className="hover:text-white transition">Sitemap</Link>
            <Link to="/accessibility" className="hover:text-white transition">Accessibility</Link> */}

            <p className='text-purple-200'>Made by Dinesh</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;