import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");
  const [openQuestions, setOpenQuestions] = useState({});

  const faqCategories = [
    { id: "general", label: "General" },
    { id: "account", label: "Account & Profile" },
    { id: "visits", label: "Visits & Bookings" },
    { id: "safety", label: "Safety & Trust" },
    { id: "payments", label: "Payments" }
  ];

  const faqItems = [
    {
      id: 1,
      category: "general",
      question: "What is Local Explorer?",
      answer: "Local Explorer is a platform that connects travelers with locals who are passionate about sharing their city. It allows you to create or join visits to explore destinations with like-minded people, gaining authentic experiences through local connections."
    },
    {
      id: 2,
      category: "general",
      question: "How is Local Explorer different from regular tours?",
      answer: "Unlike commercial tours, Local Explorer facilitates person-to-person connections. Our experiences are hosted by locals who are passionate about sharing their favorite spots, not professional tour guides. This creates more authentic, personalized experiences that often include access to hidden gems and local insights you won't find in guidebooks."
    },
    {
      id: 3,
      category: "general",
      question: "In which cities is Local Explorer available?",
      answer: "Local Explorer is currently available in 15+ cities worldwide including New York, Barcelona, Tokyo, Bangkok, London, Paris, Berlin, Rome, Sydney, Singapore, Vancouver, Mexico City, Cape Town, Amsterdam, and Lisbon. We're expanding to new locations regularly."
    },
    {
      id: 4,
      category: "account",
      question: "How do I create an account?",
      answer: "You can create an account by clicking the 'Sign Up' button in the top right corner of our website. You'll need to provide your name, email, and create a password. You can also sign up using your Google or Facebook account for quicker registration."
    },
    {
      id: 5,
      category: "account",
      question: "Can I use Local Explorer without creating an account?",
      answer: "You can browse available visits without an account, but you'll need to create one to join visits or create your own. Creating an account allows you to message other users, manage your bookings, and build your explorer profile."
    },
    {
      id: 6,
      category: "account",
      question: "How do I update my profile information?",
      answer: "Log in to your account, click on your profile picture in the top right corner, and select 'Profile Settings' from the dropdown menu. From there, you can update your personal information, change your profile picture, and edit your bio and interests."
    },
    {
      id: 7,
      category: "visits",
      question: "How do I create a visit?",
      answer: "After logging in, click the 'Create a Visit' button on the homepage or in the navigation menu. Fill out the form with details about your visit including the location, date, time, description, maximum group size, and any other relevant information. Once submitted, your visit will be visible to other users who can request to join."
    },
    {
      id: 8,
      category: "visits",
      question: "How do I join an existing visit?",
      answer: "Browse available visits through our search function or category pages. When you find a visit you'd like to join, click the 'Join Visit' button on the visit details page. The host will receive your request and can approve your participation. Once approved, you'll receive a confirmation and can access all visit details."
    },
    {
      id: 9,
      category: "visits",
      question: "Can I cancel my participation in a visit?",
      answer: "Yes, you can cancel your participation in a visit by going to 'My Visits' in your account dashboard and selecting the visit you wish to cancel. Please try to provide as much notice as possible out of courtesy to the host and other participants. Our cancellation policy may apply depending on how close to the visit date you cancel."
    },
    {
      id: 10,
      category: "safety",
      question: "How does Local Explorer ensure safety for participants?",
      answer: "Safety is our priority. We verify user identities through email and phone verification. Users can also link their social profiles for additional verification. All users have public reviews and ratings visible on their profiles. We encourage initial meetings in public places and provide safety guidelines for all participants. Additionally, our Trust & Safety team is available to assist with any concerns."
    },
    {
      id: 11,
      category: "safety",
      question: "What should I do if I feel uncomfortable during a visit?",
      answer: "If at any point you feel uncomfortable during a visit, you should prioritize your safety. You can leave the visit if necessary and report any concerns through our platform. Our Trust & Safety team is available 24/7 via the emergency support button in the app. After any visit, you can leave private feedback that helps us maintain community standards."
    },
    {
      id: 12,
      category: "payments",
      question: "Are visits on Local Explorer free?",
      answer: "Local Explorer offers both free and paid visits. Free visits are usually casual meetups where participants cover their own expenses. Paid visits may include costs for activities, transportation, or food, or may include a hosting fee that compensates the local for their time and expertise. All costs are clearly displayed before you join a visit."
    },
    {
      id: 13,
      category: "payments",
      question: "What payment methods are accepted?",
      answer: "We accept most major credit and debit cards, PayPal, and in some regions, Apple Pay and Google Pay. All payments are securely processed through our payment provider with industry-standard encryption and security protocols."
    }
  ];

  // Toggle FAQ item open/closed
  const toggleQuestion = (id) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter FAQs based on search term and active category
  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-purple-900 via-indigo-700 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl max-w-2xl mx-auto font-light">
            Find answers to common questions about Local Explorer
          </p>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search for questions or keywords..."
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-4">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                activeCategory === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              All Categories
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Listings */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-medium text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                    onClick={() => toggleQuestion(item.id)}
                  >
                    <h3 className="font-medium text-lg text-gray-800">{item.question}</h3>
                    {openQuestions[item.id] ? (
                      <ChevronUpIcon className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    )}
                  </button>
                  {openQuestions[item.id] && (
                    <div className="px-6 py-4 bg-purple-50 border-t border-gray-100">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-purple-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-purple-800 mb-4">Still Have Questions?</h2>
          <p className="text-lg text-purple-700 mb-8">
            Can't find what you're looking for? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Contact Support
            </Link>
            {/* <Link
              to="/community"
              className="px-6 py-3 bg-white text-purple-600 border border-purple-200 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Join Community Forum
            </Link> */}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default FAQPage;