import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateVisit from './pages/CreateVisite'
import Explore from './pages/explore';
import Profile from './pages/Profile';
import MyVisits from './pages/MyVisits';
import VisitDetails from './pages/VisitDetails';
import ChatPage from './pages/ChatPage';
import UserProfile from './pages/UserProfile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ChatProvider } from './context/ChatContext';
import {ToastContainer} from 'react-toastify'
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FAQPage from './pages/Faq';
import Footer from './components/Footer';


function App() {
  return (
    <>
    <ChatProvider>
     <ToastContainer
      position="top-right" // Position of the toast
      autoClose={1000} // Auto-close after 3 seconds
      hideProgressBar={false} // Show or hide the progress bar
      newestOnTop={true} // Display newest toast on top
      closeOnClick // Close the toast when clicked
      rtl={false} // Right-to-left support
      pauseOnFocusLoss // Pause auto-close when the window loses focus
      draggable // Allow dragging the toast
      pauseOnHover // Pause auto-close when hovered
      theme="colored" // Theme: "light", "dark", or "colored"
     />
     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
         <Route path='/explore' element={<Explore />} />
         <Route path='/profile' element={<Profile />} />
         <Route path='/about' element={<AboutUs />} />
         <Route path='/faq' element={<FAQPage />} />
         <Route path='/contact' element={<ContactUs/>} />
        <Route path='/create-visit' element={<CreateVisit />} />
        <Route path="/visit/:id" element={<VisitDetails />} />
        <Route path="/my-visits" element={<MyVisits />} />
        <Route path='/profile/:id' element={<UserProfile />} />
        <Route path='/chat/:id' element={<ChatPage />} />
        
        '
        {/* Add more routes here as needed */}
      </Routes>
      <Footer/>
      </GoogleOAuthProvider>
      </ChatProvider>
    </>
  );
}

export default App;
