import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer: React.FC = () => {
  console.log("Rendering Footer...");
  return (
    <footer className="bg-softOlive text-white py-12">
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-12">
        {/* Newsletter Subscription Section */}
        <div>
          <h3 className="text-lg font-bold text-black mb-4">Subscribe to Our Newsletter</h3>
          <p className="text-white mb-4">
            Stay updated with our latest offers and products!
          </p>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-md text-gray-800"
            />
            <button
              type="submit"
              className="bg-olive-50 text-black font-bold px-4 py-2 rounded-md hover:bg-olive-500 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-lg text-black font-bold mb-4">Quick Links</h3>
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
          <h3 className="text-lg font-bold text-black mb-4">Follow Us</h3>
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