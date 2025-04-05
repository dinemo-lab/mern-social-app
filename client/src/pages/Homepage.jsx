import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisits } from "../store/VisitSlice";
import { Link, useNavigate } from "react-router-dom";
import { CalendarIcon, MapPinIcon, SearchIcon, UsersIcon } from "lucide-react";
import HeroSection from "../components/HeroSection";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visits, loading, error } = useSelector((state) => state.visits);
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [popularCategories] = useState([
    { name: "History & Architecture", icon: "🏛️", count: 45 },
    { name: "Food & Markets", icon: "🍽️", count: 38 },
    { name: "Nature & Parks", icon: "🌿", count: 32 },
    { name: "Arts & Culture", icon: "🎭", count: 29 }
  ]);

  useEffect(() => {
    dispatch(fetchVisits());
  }, [dispatch]);

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
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-purple-800">How Local Explorer Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl mx-auto mb-5 shadow-md">1</div>
              <h3 className="text-xl font-semibold mb-3 text-purple-800">Create or Join</h3>
              <p className="text-gray-600">Create your own visit or join one that matches your interests and schedule.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl mx-auto mb-5 shadow-md">2</div>
              <h3 className="text-xl font-semibold mb-3 text-purple-800">Connect</h3>
              <p className="text-gray-600">Meet like-minded explorers and locals willing to show you around.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl mx-auto mb-5 shadow-md">3</div>
              <h3 className="text-xl font-semibold mb-3 text-purple-800">Explore</h3>
              <p className="text-gray-600">Discover new places and make memories with your new exploration companions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stats */}
      <section className="bg-purple-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-purple-100">
              <p className="text-4xl font-bold text-purple-600 mb-2">{visits.length || 0}</p>
              <p className="text-gray-600">Active Visits</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-purple-100">
              <p className="text-4xl font-bold text-purple-600 mb-2">15+</p>
              <p className="text-gray-600">Cities Covered</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-purple-100">
              <p className="text-4xl font-bold text-purple-600 mb-2">300+</p>
              <p className="text-gray-600">Happy Explorers</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-purple-100">
              <p className="text-4xl font-bold text-purple-600 mb-2">4.8</p>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Visits */}
      {featuredVisits.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-purple-800 mb-3">Featured Experiences</h2>
            <p className="text-gray-600 mb-10">Join our most popular visits and connect with other explorers</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {featuredVisits.map((visit) => {
                const visitDate = new Date(visit.date);
                return (
                  <div key={visit._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group border border-purple-100">
                    <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-500 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <span className="px-3 py-1 bg-purple-600 rounded-full text-xs font-medium">Featured</span>
                      </div>
                    </div>
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
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Popular Categories */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-purple-800 mb-3">Explore by Category</h2>
          <p className="text-gray-600 mb-10">Discover visits based on your interests</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCategories.map((category, index) => (
              <Link 
                key={index} 
                to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center border border-purple-100"
              >
                <span className="text-3xl mb-3 inline-block">{category.icon}</span>
                <h3 className="text-lg font-medium text-purple-800 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} visits</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Requests with Filtering */}
      <section className="max-w-5xl mx-auto py-20 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-bold text-purple-800 mb-2">Explore All Visits</h2>
            <p className="text-gray-600">Find the perfect experience for your next adventure</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-6 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search locations or descriptions..."
                className="pl-10 pr-4 py-3 border border-purple-200 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
            </div>
            <select
              className="px-4 py-3 border border-purple-200 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Visits</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <p className="text-red-600 mb-2">Oops! Something went wrong.</p>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => dispatch(fetchVisits())}
              className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
            >
              Try Again
            </button>
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="text-center py-16 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-purple-800 mb-2">No visits found</h3>
            <p className="text-gray-600 mb-6">We couldn't find any visits matching your criteria.</p>
            <button
              onClick={handleCreateVisit}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition font-medium shadow-md"
            >
              Create a New Visit
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredVisits.map((visit) => {
              const visitDate = new Date(visit.date);
              const isPast = visitDate < new Date();
              const isToday = visitDate.toDateString() === new Date().toDateString();

              return (
                <div
                  key={visit._id}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition group border border-purple-100 relative overflow-hidden"
                >
                  {/* Decorative accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  
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
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">Today</span>
                    ) : (
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">Upcoming</span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-2">{visit.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {/* Attendee indicators */}
                        <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs text-purple-700 font-medium">
                          {visit.attendees?.length || 0}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">explorers</span>
                    </div>
                    <Link
                      to={`/visit/${visit._id}`}
                      className="text-indigo-600 font-medium hover:text-purple-800 flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {!loading && !error && filteredVisits.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition font-medium"
            >
              <span>View All Visits</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-700 py-20 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">What Our Explorers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm shadow-lg">
              <p className="italic mb-6">"I was traveling alone and found the perfect group to explore the city with. Made friends that I still keep in touch with!"</p>
              <p className="font-semibold">Sarah K.</p>
              <p className="text-purple-200 text-sm">New York</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm shadow-lg">
              <p className="italic mb-6">"As a local, I love showing visitors my favorite hidden spots. This platform makes it easy to connect with travelers."</p>
              <p className="font-semibold">Miguel R.</p>
              <p className="text-purple-200 text-sm">Barcelona</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm shadow-lg">
              <p className="italic mb-6">"Found an amazing food tour through this site. The local insights made it so much better than any commercial tour."</p>
              <p className="font-semibold">Jen T.</p>
              <p className="text-purple-200 text-sm">Tokyo</p>
            </div>
          </div>
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
              to="/browse-visits"
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