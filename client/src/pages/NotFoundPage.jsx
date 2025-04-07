import React from 'react';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-600 rounded-xl p-8 shadow-lg text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-purple-300 opacity-20 blur-xl"></div>
        
        {/* Error code */}
        <h1 className="text-8xl font-bold text-white mb-2">404</h1>
        
        {/* Message */}
        <h2 className="text-2xl font-semibold text-white mb-6">Page Not Found</h2>
        <p className="text-purple-100 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        
        {/* Back button */}
        <button 
          onClick={() => window.history.back()} 
          className="inline-flex items-center cursor-pointer px-6 py-3 text-base font-medium text-purple-700 bg-white rounded-lg hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-300 focus:ring-offset-purple-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;