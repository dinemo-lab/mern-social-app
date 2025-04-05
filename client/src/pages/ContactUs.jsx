import React, { useState } from "react";
import { MapPinIcon, MailIcon, PhoneIcon, ClockIcon, SendIcon } from "lucide-react";
import axios from "axios"; // Import Axios
 // Import Toastify for notifications
 // Import Toastify CSS
 import { toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
 

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_LOCAL_URL}/api/contact`, formData);

      if (response.status === 200) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        toast.success("Your message has been sent successfully!");
      } else {
        toast.error("Failed to send your message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(
        error.response?.data?.message || "Failed to send your message. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-purple-900 via-indigo-700 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl max-w-2xl mx-auto font-light">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Information and Form */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-purple-800 mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-6">
                  Reach out to us with any questions about our platform, partnership opportunities, or general inquiries.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <MailIcon size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-800">Email Us</h3>
                  <p className="text-gray-600">dineshmourya02@gmail.com</p>
                  <p className="text-gray-600">support@localexplorer.com</p>
                </div>
              </div>
              
              
              
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <ClockIcon size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-800">Support Hours</h3>
                  
                  <p className="text-gray-600">Weekend: 10am - 4pm IST</p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-2 bg-white shadow-md rounded-xl p-8 border border-purple-100">
              <h2 className="text-2xl font-bold text-purple-800 mb-6">Send Us a Message</h2>
              
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-lg mb-6">
                  <p className="font-medium">Thank you for reaching out!</p>
                  <p>We've received your message and will get back to you shortly.</p>
                </div>
              ) : null}
              
              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition resize-none"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <SendIcon size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

 

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-purple-800 mb-6">Common Questions</h2>
          <p className="text-gray-600 mb-12">
            Can't find what you're looking for? Check our FAQ section for more information.
          </p>
          <div className="flex justify-center">
            <a
              href="/faq"
              className="bg-purple-100 text-purple-700 px-8 py-4 rounded-lg font-semibold hover:bg-purple-200 transition flex items-center gap-2"
            >
              <span>View FAQ Page</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;