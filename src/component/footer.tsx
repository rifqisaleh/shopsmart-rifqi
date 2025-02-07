import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
const Footer: React.FC = () => {


  const [newsletterStatus, setNewsletterStatus] = useState('idle');
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    
    try {
      // Add your newsletter signup logic here
      // For example: await axios.post('/api/newsletter', { email });
      setNewsletterStatus('success');
      setEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 3000); // Reset after 3s
    } catch (error) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  return (
    <footer className="bg-softOlive text-white py-12">
        <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-3 gap-16 md:gap-24">
          {/* Newsletter Subscription Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-urbanChic-500">Subscribe to Our Newsletter</h3>
            <p className="text-white">
              Stay updated with our latest offers and products!
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col items-start gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 text-black border rounded-lg"
                required
              />
              <button 
                type="submit"
                className="w-full bg-olive-50 text-black px-4 py-2 rounded-lg font-bold hover:bg-olive-200 focus:outline-none"
              >   
                Subscribe
              </button>
              {newsletterStatus === 'success' && (
                <p className="text-green-600">Thank you for subscribing!</p>
              )}
              {newsletterStatus === 'error' && (
                <p className="text-red-600">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        
        {/* Quick Links Section */}
        <div>
          <h3 className="text-lg text-urbanChic-500 font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:underline text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:underline text-white">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:underline text-white">
                Terms & Conditions
              </Link>
              </li>
              <li>
              <Link href="/aboutus" className="hover:underline text-white">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Icons Section */}
        <div>
          <h3 className="text-lg font-bold text-urbanChic-500 mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-white hover:text-blue-500">
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <a href="#" className="text-white hover:text-pink-500">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a href="#" className="text-white hover:text-blue-400">
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
            <a href="#" className="text-white hover:text-blue-700">
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <div className="text-center mt-8">
        <p className="text-gray-500">©2025 ShopSmartApp. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;