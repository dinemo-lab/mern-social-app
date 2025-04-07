import React from "react";
import { Link } from "react-router-dom";
import { MapIcon, UsersIcon, GlobeIcon, HeartIcon, GithubIcon, LinkedinIcon, Code2Icon, DatabaseIcon, ServerIcon, LayersIcon, LayoutIcon, ChartArea } from "lucide-react";
import { motion } from "framer-motion";
import { FaRocketchat } from "react-icons/fa";

const AboutUs = () => {
  // Animation variants for fade-in effect
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Animation variants for staggered children
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Animation for tech cards
  const techCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-r from-purple-900 via-indigo-700 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">My Story</h1>
          <p className="text-xl max-w-3xl mx-auto font-light">
            I'm building a platform for explorers and locals passionate about
            authentic experiences.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-purple-800 mb-6">
                My Mission
              </h2>
              <p className="text-gray-600 mb-4">
                Local Explorer was born from my simple idea: the best travel
                experiences come from local connections. I believe that
                authentic exploration happens when travelers connect with locals
                who share their passion for discovery.
              </p>
              <p className="text-gray-600 mb-4">
                My mission is to bridge the gap between travelers and locals,
                creating meaningful connections and unforgettable experiences
                that benefit both communities and visitors.
              </p>
              <p className="text-gray-600">
                Whether you're a traveler looking to discover hidden gems or a
                local eager to share your favorite spots, Local Explorer creates
                the space for authentic cultural exchange.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-6 rounded-xl text-center">
                <GlobeIcon size={36} className="mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-purple-800 mb-2">
                  Global Community
                </h3>
                <p className="text-gray-600 text-sm">
                  Connecting explorers across 15+ cities worldwide
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl text-center">
                <UsersIcon size={36} className="mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-purple-800 mb-2">
                  Local Connections
                </h3>
                <p className="text-gray-600 text-sm">
                  Bringing travelers and locals together
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl text-center">
                <MapIcon size={36} className="mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-purple-800 mb-2">
                  Hidden Gems
                </h3>
                <p className="text-gray-600 text-sm">
                  Discover places only locals know about
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl text-center">
                <HeartIcon size={36} className="mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-purple-800 mb-2">
                  Shared Passions
                </h3>
                <p className="text-gray-600 text-sm">
                  Connect through common interests
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Used - NEW SECTION */}
      <section className="py-24 bg-gradient-to-br from-purple-100 to-indigo-50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-purple-800 mb-6">
              Technologies Used
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              I've built Local Explorer using modern technologies to create a seamless, 
              responsive, and engaging experience for our community.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            <motion.div 
              variants={techCardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm p-6 text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Code2Icon size={30} className="text-purple-700" />
              </div>
              <h3 className="text-purple-800 font-semibold mb-2">React</h3>
              <p className="text-gray-600 text-sm">Frontend library for building user interfaces</p>
            </motion.div>
            
            <motion.div 
              variants={techCardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm p-6 text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <LayersIcon size={30} className="text-purple-700" />
              </div>
              <h3 className="text-purple-800 font-semibold mb-2">Tailwind CSS</h3>
              <p className="text-gray-600 text-sm">Utility-first CSS framework</p>
            </motion.div>
            
            <motion.div 
              variants={techCardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm p-6 text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <ServerIcon size={30} className="text-purple-700" />
              </div>
              <h3 className="text-purple-800 font-semibold mb-2">Node.js</h3>
              <p className="text-gray-600 text-sm">JavaScript runtime for server-side logic</p>
            </motion.div>
            <motion.div 
              variants={techCardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm p-6 text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FaRocketchat size={30} className="text-purple-700" />
              </div>
              <h3 className="text-purple-800 font-semibold mb-2">Socket.io</h3>
              <p className="text-gray-600 text-sm">For communication</p>
            </motion.div>
            
            <motion.div 
              variants={techCardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm p-6 text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <DatabaseIcon size={30} className="text-purple-700" />
              </div>
              <h3 className="text-purple-800 font-semibold mb-2">MongoDB</h3>
              <p className="text-gray-600 text-sm">NoSQL database for flexible data storage</p>
            </motion.div>
            
            <motion.div 
              variants={techCardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm p-6 text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <LayoutIcon size={30} className="text-purple-700" />
              </div>
              <h3 className="text-purple-800 font-semibold mb-2">Framer Motion</h3>
              <p className="text-gray-600 text-sm">Animation library for interactive UI</p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600">
              Each technology was carefully selected to ensure a scalable, maintainable, 
              and performant application that brings people together.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-purple-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-purple-800 mb-16">
            My Journey
          </h2>
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="bg-purple-100 p-4 rounded-xl text-center">
                  <h3 className="text-purple-800 font-semibold">2024</h3>
                  <p className="text-lg font-medium text-purple-600">
                    The Beginning
                  </p>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600">
                  I started Local Explorer in 2024 with a vision to connect
                  travelers and locals for authentic experiences. My journey
                  began with a passion for creating meaningful connections and a
                  desire to transform how people experience new places.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">
            About Me
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            I'm a passionate developer and travel enthusiast dedicated to
            creating meaningful connections around the world.
          </p>

          <div className="flex justify-center">
            <div className="text-center max-w-md">
              <div className="rounded-full overflow-hidden mb-4 w-32 h-32 mx-auto border-4 border-purple-100">
                <img
                  src="/dinesh.jpeg"
                  alt="Dinesh"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-purple-800">Dinesh</h3>
              <p className="text-purple-600 text-sm mb-2">
                Founder & Software Developer
              </p>
              <div className="flex justify-center space-x-4 mb-4">
                <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-purple-700 transition-colors">
                  <GithubIcon size={24} />
                </a>
                <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-purple-700 transition-colors">
                  <LinkedinIcon size={24} />
                </a>
              </div>
              <p className="text-gray-600">
                I'm a passionate software developer with a love for building
                scalable and user-friendly applications. My background in
                technology and personal experiences with travel inspired me to
                create Local Explorer, where I combine my technical skills with
                my passion for authentic exploration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">
            My Values
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            The principles that guide everything I do at Local Explorer
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4">
                Authentic Connection
              </h3>
              <p className="text-gray-600">
                I believe meaningful human connections create the most memorable
                experiences. My platform prioritizes genuine interactions over
                transactional experiences.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4">
                Responsible Tourism
              </h3>
              <p className="text-gray-600">
                I promote sustainable and responsible exploration that benefits
                local communities while preserving cultural heritage and natural
                environments.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4">
                Cultural Exchange
              </h3>
              <p className="text-gray-600">
                I celebrate diversity and foster mutual understanding through
                shared experiences that bridge cultural differences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-indigo-700 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join My Community</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Whether you're a traveler seeking authentic experiences or a local
            wanting to share your passion, I've created a place for you in this
            community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-purple-700 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition shadow-lg"
            >
              Sign Up Now
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-700 transition"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;