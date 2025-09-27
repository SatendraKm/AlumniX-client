// import React from "react";
import NsquareLogo from "../../assets/icons/nsqure.svg";
import NetworkNext from "../../assets/icons/Network Next.svg";

const Footer = () => {
  return (
    <footer className="bg-white text-black font-sans border-t border-gray-200">
      {/* Top Section */}
      <div className="container mx-auto px-5 py-6 grid grid-cols-1 md:grid-cols-5">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 relative top-[-40px]">
          <img src={NsquareLogo} alt="Nsquare Logo" className="w-10 h-10" />
          <img
            src={NetworkNext}
            alt="Network Next Logo"
            className="h-5 w-auto"
          />
        </div>

        {/* About Us Section */}
        <div>
          <h3 className="text-base font-semibold mb-1">About Us</h3>
          <ul className="space-y-1">
            <li>
              <a href="/home" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/contact-us" className="hover:underline">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/faqs" className="hover:underline">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-base font-semibold mb-1">Support</h3>
          <ul className="space-y-1">
            <li>
              <a href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms-of-service" className="hover:underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/cookie-policy" className="hover:underline">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Updates Section */}
        <div>
          <h3 className="text-base font-semibold mb-1">Updates</h3>
          <ul className="space-y-1">
            <li>
              <a href="/terms-and-conditions" className="hover:underline">
                Terms and Conditions
              </a>
            </li>
            <li>
              <a href="/privacy-statement" className="hover:underline">
                Privacy Statement
              </a>
            </li>
            <li>
              <a href="/cookie-settings" className="hover:underline">
                Cookie Settings
              </a>
            </li>
          </ul>
        </div>

        {/* "Still Have Questions?" Section */}
        <div>
          <h3 className="text-base font-semibold mb-1">
            Still have questions?
          </h3>
          <p className="text-sm text-gray-600 mb-4 leading-6">
            Feel free to reach out, and our dedicated support team will be happy
            to assist you on your financial journey.
          </p>
          <button className="border-2 border-black px-6 py-2 text-sm font-semibold rounded-full hover:bg-black hover:text-white transition">
            Contact Us
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t-2 border-black mt-6">
        <div className="container mx-auto px-6 py-3 flex flex-col md:flex-row md:items-center justify-center text-sm text-center">
          {/* Copyright */}
          <p className="text-gray-600 md:mb-0 mr-4">
            ©2024 N Sqaure. All rights reserved.
          </p>
          {/* Links */}
          <div className="flex space-x-3">
            <a href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="hover:underline">
              Terms of Service
            </a>
            <a href="/cookie-settings" className="hover:underline">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
      <div className="py-6"></div>
    </footer>
  );
};

export default Footer;
