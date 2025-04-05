import React from "react";
import { Link } from "react-router-dom";
import { MapIcon, UsersIcon, GlobeIcon, HeartIcon } from "lucide-react";

const AboutUs = () => {
  const teamMembers = [
    {
        name: "Dinesh",
        role: "Software Developer",
        image: "/api/placeholder/150/150", // Replace with the actual image URL if available
        bio: "Passionate software developer with a love for building scalable and user-friendly applications."
    },
   
  ];

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-r from-purple-900 via-indigo-700 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl max-w-3xl mx-auto font-light">
            We're building a community of explorers and locals passionate about authentic experiences.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-purple-800 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                Local Explorer was born from a simple idea: the best travel experiences come from local connections. We believe that authentic exploration happens when travelers connect with locals who share their passion for discovery.
              </p>
              <p className="text-gray-600 mb-4">
                Our mission is to bridge the gap between travelers and locals, creating meaningful connections and unforgettable experiences that benefit both communities and visitors.
              </p>
              <p className="text-gray-600">
                Whether you're a traveler looking to discover hidden gems or a local eager to share your favorite spots, Local Explorer creates the space for authentic cultural exchange.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-6 rounded-xl text-center">
                <GlobeIcon size={36} className="mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-purple-800 mb-2">Global Community</h3>
                <p className="text-gray-600 text-sm">Connecting explorers across 15+ cities worldwide</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl text-center">
                <UsersIcon size={36} className="mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-purple-800 mb-2">Local Connections</h3>
                <p className="text-gray-600 text-sm">Bringing travelers and locals together</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl text-center">
                <MapIcon size={36} className="mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-purple-800 mb-2">Hidden Gems</h3>
                <p className="text-gray-600 text-sm">Discover places only locals know about</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl text-center">
                <HeartIcon size={36} className="mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-purple-800 mb-2">Shared Passions</h3>
                <p className="text-gray-600 text-sm">Connect through common interests</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-purple-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-purple-800 mb-16">Our Journey</h2>
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="bg-purple-100 p-4 rounded-xl text-center">
                  <h3 className="text-purple-800 font-semibold">2024</h3>
                  <p className="text-lg font-medium text-purple-600">The Beginning</p>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600">
                  Local Explorer started in 2024 with a vision to connect travelers and locals for authentic experiences. Our journey began with a small but passionate team dedicated to creating meaningful connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">Meet Our Team</h2>
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            We're a diverse team of travelers, locals, and technology enthusiasts passionate about creating meaningful connections around the world.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="rounded-full overflow-hidden mb-4 w-32 h-32 mx-auto border-4 border-purple-100">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-purple-800">{member.name}</h3>
                <p className="text-purple-600 text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">Our Values</h2>
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            The principles that guide everything we do at Local Explorer
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Authentic Connection</h3>
              <p className="text-gray-600">
                We believe meaningful human connections create the most memorable experiences. Our platform prioritizes genuine interactions over transactional experiences.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Responsible Tourism</h3>
              <p className="text-gray-600">
                We promote sustainable and responsible exploration that benefits local communities while preserving cultural heritage and natural environments.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Cultural Exchange</h3>
              <p className="text-gray-600">
                We celebrate diversity and foster mutual understanding through shared experiences that bridge cultural differences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-indigo-700 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Whether you're a traveler seeking authentic experiences or a local wanting to share your passion, there's a place for you in our community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="bg-white text-purple-700 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition shadow-lg">
              Sign Up Now
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-700 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;