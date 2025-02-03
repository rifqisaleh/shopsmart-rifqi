import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer: React.FC = () => {
  console.log("Rendering Footer...");
  return (
    <footer className="bg-gray-900 text-white py-8">
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Shipping Policy Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">Shipping Policy</h3>
          <p className="text-gray-400">
            We offer fast and reliable shipping to your doorstep. Orders are processed within 24 hours on business days.
          </p>
          <p className="text-gray-400">
            For detailed information, visit our <a href="/shipping-policy" className="text-blue-400 hover:underline">Shipping Policy</a> page.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:underline text-gray-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:underline text-gray-400">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:underline text-gray-400">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Icons Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-500">
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-500">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400">
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-700">
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