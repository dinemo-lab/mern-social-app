import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon ,CalendarIcon,MapPinIcon} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {

  const Navigate = useNavigate();


  return (
    <motion.section 
      className="relative h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-violet-900 text-white overflow-hidden flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Moving background elements */}
      <motion.div 
        className="absolute inset-0 overflow-hidden z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div
          className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-blue-400 opacity-20 blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute left-1/3 bottom-0 w-64 h-64 rounded-full bg-purple-300 opacity-20 blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute left-10 top-1/4 w-44 h-44 rounded-full bg-violet-500 opacity-10 blur-3xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, 20, 0],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 25,
            ease: "easeInOut" 
          }}
        />
      </motion.div>
      
      {/* Foreground content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center">
        <motion.div
          className="md:w-6xl text-center md:text-left mb-16 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-6"
          >
         <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium inline-block mb-6 border border-white/40 shadow-lg shadow-white/20">
  Local Exploration Redefined
</span>
          </motion.div>
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span className="block">Explore With</span> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-cyan-200">Locals & Travelers</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-10 font-light text-purple-100 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            Discover hidden gems, connect with people, and create unforgettable experiences in any city you visit.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <motion.button
              type="button"
              onClick={() => Navigate("/create-visit")}
              className="group bg-white text-indigo-700 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Create a Visit</span>
              <motion.span 
                className="group-hover:translate-x-1"
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 1,
                  repeatDelay: 1
                }}
              >
                <ArrowRightIcon size={18} />
              </motion.span>
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/explore"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <span>Browse Visits</span>
                <ArrowRightIcon size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Interactive 3D card display */}
        <motion.div 
          className="md:w-1/2 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="relative h-96 perspective-1000">
            {[1, 2, 3].map((item, index) => (
              <motion.div
                key={index}
                className="absolute top-0 left-0 right-0 rounded-xl shadow-xl overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${index === 0 ? '#6366f1' : index === 1 ? '#8b5cf6' : '#d946ef'} 0%, rgba(0,0,0,0.3) 100%)`,
                  height: '320px',
                  zIndex: 3 - index,
                }}
                initial={{ y: 30 * index, x: 20 * index, opacity: 0.9 - (index * 0.2) }}
                animate={{ 
                  y: [30 * index, 40 * index, 30 * index],
                  x: [20 * index, 15 * index, 20 * index],
                  rotateX: [0, 5, 0],
                  rotateY: [0, -5, 0],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 5 + index,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              >
                <div className="p-8 text-white h-full flex flex-col justify-between">
                  <div>
                    <div className="mb-2 flex justify-between items-center">
                      <div className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs rounded-full font-medium">
                        {index === 0 ? "Most Popular" : index === 1 ? "Featured" : "New"}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon size={14} />
                        <span className="text-xs">
                          {new Date().toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {index === 0 ? "Historic Downtown Tour" : 
                       index === 1 ? "Food Market Exploration" : 
                       "Sunset Photography Walk"}
                    </h3>
                    <p className="text-sm text-white/80 line-clamp-3">
                      {index === 0 ? "Discover hidden architectural gems and learn about the city's rich history with local guides." : 
                       index === 1 ? "Sample authentic local cuisine and specialties while exploring vibrant market streets." : 
                       "Capture stunning sunset views at the best photography spots with fellow enthusiasts."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 border-2 border-white flex items-center justify-center">
                            <span className="text-xs">
                              {String.fromCharCode(65 + i)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-white/80">+{(index + 2) * 3} joined</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <MapPinIcon size={14} />
                      <span>
                        {index === 0 ? "Downtown" : 
                         index === 1 ? "Central Market" : 
                         "Harbor View"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2
        }}
      >
        <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
        <motion.div 
          className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center"
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-white rounded-full mt-2"
            animate={{ 
              y: [0, 15, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2
            }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;