import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisits } from "../store/VisitSlice";
import { Link, useNavigate } from "react-router-dom";
import { CalendarIcon, MapPinIcon, SearchIcon, UsersIcon } from "lucide-react";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visits, loading, error } = useSelector((state) => state.visits);
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [popularCategories] = useState([
    { name: "History & Architecture", icon: "🏛️"},
    { name: "Food & Markets", icon: "🍽️", },
    { name: "Nature & Parks", icon: "🌿", },
    { name: "Arts & Culture", icon: "🎭", }
  ]);

  // Refs for GSAP animations
  const featuredStatsRef = useRef(null);
  const featuredVisitsRef = useRef(null);
  const categoriesRef = useRef(null);
  const visitsListRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    dispatch(fetchVisits());
  }, [dispatch]);

  // GSAP animations setup
  useEffect(() => {
    // Stats counter animation
    const statsElements = featuredStatsRef.current?.querySelectorAll('.stat-item');
    if (statsElements) {
      gsap.from(statsElements, {
        textContent: 0,
        duration: 2,
        ease: "power1.inOut",
        snap: { textContent: 1 },
        stagger: 0.2,
        scrollTrigger: {
          trigger: featuredStatsRef.current,
          start: "top 80%",
        }
      });
    }

    // Featured visits animation
    if (featuredVisitsRef.current) {
      gsap.from(featuredVisitsRef.current.querySelectorAll('.featured-visit'), {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuredVisitsRef.current,
          start: "top 75%",
        }
      });
    }

    // Categories animation
    if (categoriesRef.current) {
      gsap.from(categoriesRef.current.querySelectorAll('.category-item'), {
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: categoriesRef.current,
          start: "top 80%",
        }
      });
    }

    // Visits list animation
    if (visitsListRef.current) {
      gsap.from(visitsListRef.current.querySelectorAll('.visit-card'), {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: visitsListRef.current,
          start: "top 75%",
        }
      });
    }

    // Testimonials parallax effect
    if (testimonialsRef.current) {
      gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        gsap.from(card, {
          y: 100 * direction,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 80%",
          }
        });
      });
    }

    // CTA section animation
    if (ctaRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 75%",
        }
      });
      
      tl.from(ctaRef.current.querySelector('h2'), {
        y: 30,
        opacity: 0,
        duration: 0.6
      })
      .from(ctaRef.current.querySelector('p'), {
        y: 30,
        opacity: 0,
        duration: 0.6
      }, "-=0.3")
      .from(ctaRef.current.querySelectorAll('button, a'), {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.6
      }, "-=0.3");
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [visits]);

  // Filter visits based on date and search term
  const filteredVisits = visits.filter((visit) => {
    const visitDate = new Date(visit.date);
    const today = new Date();
    const matchesSearch =
      visit.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "today") {
      return visitDate.toDateString() === today.toDateString() && matchesSearch;
    } else if (filter === "upcoming") {
      return visitDate > today && matchesSearch;
    } else if (filter === "past") {
      return visitDate < today && matchesSearch;
    }
    return matchesSearch;
  });

  // Get featured visits (most popular or highlighted)
  const featuredVisits = [...visits]
    .sort((a, b) => (b.attendees?.length || 0) - (a.attendees?.length || 0))
    .slice(0, 3);

  // Handle navigation to "Create Visit"
  const handleCreateVisit = () => {
    if (user) {
      navigate("/create-visit");
    } else {
      navigate("/login");
    }
  };

 

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Hero Section with Animation */}
      <HeroSection />
     
      {/* How It Works */}
      <HowItWorks />

{/*      
      <section className="bg-purple-50 py-16" ref={featuredStatsRef}>
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div className="p-6 bg-white rounded-xl shadow-sm border border-purple-100 stat-item" variants={fadeInUp}>
              <p className="text-4xl font-bold text-purple-600 mb-2">{visits.length || 0}</p>
              <p className="text-gray-600">Active Visits</p>
              <motion.div 
                className="h-1 w-0 bg-purple-500 mx-auto mt-3"
                animate={{ width: "60%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>
            <motion.div className="p-6 bg-white rounded-xl shadow-sm border border-purple-100 stat-item" variants={fadeInUp}>
              <p className="text-4xl font-bold text-purple-600 mb-2">15+</p>
              <p className="text-gray-600">Cities Covered</p>
              <motion.div 
                className="h-1 w-0 bg-purple-500 mx-auto mt-3"
                animate={{ width: "60%" }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </motion.div>
            <motion.div className="p-6 bg-white rounded-xl shadow-sm border border-purple-100 stat-item" variants={fadeInUp}>
              <p className="text-4xl font-bold text-purple-600 mb-2">300+</p>
              <p className="text-gray-600">Happy Explorers</p>
              <motion.div 
                className="h-1 w-0 bg-purple-500 mx-auto mt-3"
                animate={{ width: "60%" }}
                transition={{ duration: 1, delay: 0.9 }}
              />
            </motion.div>
            <motion.div className="p-6 bg-white rounded-xl shadow-sm border border-purple-100 stat-item" variants={fadeInUp}>
              <p className="text-4xl font-bold text-purple-600 mb-2">4.8</p>
              <p className="text-gray-600">Average Rating</p>
              <motion.div 
                className="h-1 w-0 bg-purple-500 mx-auto mt-3"
                animate={{ width: "60%" }}
                transition={{ duration: 1, delay: 1.1 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section> */}

      {/* Featured Visits */}
      {featuredVisits.length > 0 && (
        <section className="py-20 bg-white" ref={featuredVisitsRef}>
          <div className="max-w-5xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-purple-800 mb-3">Featured Experiences</h2>
              <p className="text-gray-600 mb-10">Join our most popular visits and connect with other explorers</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {featuredVisits.map((visit, index) => {
                const visitDate = new Date(visit.date);
                return (
                  <motion.div 
                    key={visit._id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group border border-purple-100 featured-visit"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  >
                    <motion.div 
                      className="h-48 bg-gradient-to-br from-indigo-500 to-purple-500 relative"
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      <motion.div 
                        className="absolute bottom-4 left-4 text-white"
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <span className="px-3 py-1 bg-purple-600 rounded-full text-xs font-medium">Featured</span>
                      </motion.div>
                    </motion.div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-purple-800 group-hover:text-indigo-600 transition">{visit.location}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-2 mb-3">
                        <CalendarIcon size={16} className="text-purple-400" />
                        <span>
                          {visitDate.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                      <p className="text-gray-600 line-clamp-3 mb-4">{visit.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <UsersIcon size={16} className="text-purple-500" />
                          <span className="text-gray-600 text-sm">{visit.attendees?.length || 0} joined</span>
                        </div>
                        <Link
                          to={`/visit/${visit._id}`}
                          className="text-indigo-600 font-medium hover:text-purple-800 flex items-center gap-1"
                        >
                          <span>Details</span>
                          <motion.span 
                            className="group-hover:translate-x-1 transition-transform"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ 
                              repeat: Infinity, 
                              repeatType: "loop", 
                              duration: 1.5, 
                              ease: "easeInOut",
                              repeatDelay: 0.5
                            }}
                          >→</motion.span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Popular Categories */}
      <section className="py-16 bg-purple-50" ref={categoriesRef}>
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-purple-800 mb-3">Explore by Category</h2>
            <p className="text-gray-600 mb-10">Discover visits based on your interests</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCategories.map((category, index) => (
              <motion.div
                key={index}
                className="category-item"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <Link 
                   
                  className="bg-white p-6 rounded-xl shadow-sm transition text-center border border-purple-100 block h-full"
                >
                  <motion.span 
                    className="text-3xl mb-3 inline-block"
                    animate={{ 
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: index * 0.2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >{category.icon}</motion.span>
                  <h3 className="text-lg font-medium text-purple-800 mb-1">{category.name}</h3>
                  
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Requests with Filtering */}
      <section className="max-w-5xl mx-auto py-20 px-4" ref={visitsListRef}>
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-purple-800 mb-2">Explore All Visits</h2>
            <p className="text-gray-600">Find the perfect experience for your next adventure</p>
          </motion.div>
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-6 md:mt-0"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <motion.input
                type="text"
                placeholder="Search locations or descriptions..."
                className="pl-10 pr-4 py-3 border border-purple-200 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                whileFocus={{ 
                  boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.3)",
                  borderColor: "#8b5cf6"
                }}
              />
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
            </div>
            <motion.select
              className="px-4 py-3 border border-purple-200 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              whileFocus={{ 
                boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.3)",
                borderColor: "#8b5cf6"
              }}
            >
              <option value="all">All Visits</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </motion.select>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div 
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          </div>
        ) : error ? (
          <motion.div 
            className="text-center py-12 bg-red-50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-600 mb-2">Oops! Something went wrong.</p>
            <p className="text-gray-600 mb-6">{error}</p>
            <motion.button
              onClick={() => dispatch(fetchVisits())}
              className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : filteredVisits.length === 0 ? (
          <motion.div 
            className="text-center py-16 bg-purple-50 rounded-lg border border-purple-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-5xl mb-4"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >🔍</motion.div>
            <h3 className="text-xl font-semibold text-purple-800 mb-2">No visits found</h3>
            <p className="text-gray-600 mb-6">We couldn't find any visits matching your criteria.</p>
            <motion.button
              onClick={handleCreateVisit}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition font-medium shadow-md"
              whileHover={{ scale: 1.05, boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              whileTap={{ scale: 0.95 }}
            >
              Create a New Visit
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredVisits.map((visit, index) => {
              const visitDate = new Date(visit.date);
              const isPast = visitDate < new Date();
              const isToday = visitDate.toDateString() === new Date().toDateString();

              return (
                <motion.div
                  key={visit._id}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition group border border-purple-100 relative overflow-hidden visit-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  {/* Decorative accent */}
                  <motion.div 
                    className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                  />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-800 group-hover:text-indigo-600 transition">{visit.location}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <CalendarIcon size={16} className="text-purple-400" />
                          <span>
                            {visitDate.toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPinIcon size={16} className="text-purple-400" />
                          <span>{visit.location.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>
                    {isPast ? (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Past</span>
                    ) : isToday ? (
                      <motion.span 
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium"
                        animate={{ 
                          backgroundColor: ["rgb(209, 250, 229)", "rgb(167, 243, 208)", "rgb(209, 250, 229)"]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >Today</motion.span>
                    ) : (
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">Upcoming</span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-2">{visit.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {/* Attendee indicators */}
                        <motion.div 
                          className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs text-purple-700 font-medium"
                          initial={{ scale: 0, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                        >
                          {visit.attendees?.length || 0}
                        </motion.div>
                      </div>
                      <span className="text-sm text-gray-500">explorers</span>
                    </div>
                    <Link
                      to={`/visit/${visit._id}`}
                      className="text-indigo-600 font-medium hover:text-purple-800 flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <motion.span 
                        className="group-hover:translate-x-1 transition-transform"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >→</motion.span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {!loading && !error && filteredVisits.length > 0 && (
          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition font-medium"
              >
                <span>View All Visits</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "loop", 
                    duration: 1.5, 
                    ease: "easeInOut",
                    repeatDelay: 1
                  }}
                >→</motion.span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-700 py-20 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">What Our User Say</h2>
          <div className="">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm shadow-lg">
              <p className="italic mb-6">"I was traveling alone and found the perfect group to explore the city with. Made friends that I still keep in touch with!"</p>
              <p className="font-semibold">Shiva</p>
              <p className="text-purple-200 text-sm">Kanpur</p>
            </div>
     
          </div>
        </div>
      </section>

      {/* FAQ Section */}
<section className="bg-white py-20">
  <div className="max-w-5xl mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-purple-800 mb-3 text-center">Frequently Asked Questions</h2>
      <p className="text-gray-600 mb-10 text-center">Everything you need to know about LocalExplorer</p>
    </motion.div>
    
    <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
      {[
        {
          question: "How do I join a visit?",
          answer: "Simply browse through available visits, find one that interests you, and click the 'Join' button on the visit details page. You'll receive a confirmation and meeting details after joining."
        },
        {
          question: "Can I create my own visit?",
          answer: "Absolutely! Click 'Create a Visit' button, fill in the details about your experience, set a date and meeting point, and publish it for others to join. You can create visits as a local or as a traveler looking for companions."
        },
        {
          question: "Is there a fee to join or create visits?",
          answer: "Creating and joining basic visits is completely free. In future we see if there will be premium features or experiences that may have a free but for now all free"
        },
        {
          question: "How do I communicate with other participants?",
          answer: "Once you join a visit, you'll have access to a group chat with the host and other participants. This makes it easy to coordinate and ask questions before meeting."
        },
    
         
      ].map((faq, index) => (
        <motion.div 
          key={index}
          className="bg-purple-50 rounded-xl p-6 border border-purple-100 hover:shadow-md transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h3 className="text-lg font-semibold text-purple-800 mb-3">{faq.question}</h3>
          <p className="text-gray-600">{faq.answer}</p>
        </motion.div>
      ))}
    </div>
    
    <motion.div 
      className="text-center mt-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <Link
        to="/faq"
        className="inline-flex items-center gap-2 text-purple-600 font-medium hover:text-purple-800 transition"
      >
        <span>View all FAQs</span>
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "loop", 
            duration: 1.5, 
            ease: "easeInOut",
            repeatDelay: 1
          }}
        >→</motion.span>
      </Link>
    </motion.div>
  </div>
</section>

      {/* Call to Action */}
      <section className="bg-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-purple-800 mb-4">Ready to Explore?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Create your own visit or join an existing one. Start your adventure today and discover new places with like-minded explorers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleCreateVisit}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
            >
              Create a Visit
            </button>
            <Link
              to="/explore"
              className="bg-white border border-purple-300 text-purple-800 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              Browse All Visits
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;