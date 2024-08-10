import React, { useState, useEffect } from "react";
import { StartFreeTrial } from "./tryfree";
import { ViewDemo } from "./viewdemo";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`fixed w-full z-20 top-0 left-0 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white bg-opacity-90"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                className="h-8 w-auto sm:h-10"
                alt="Flamingo Logo"
              />
              <span
                className={`text-2xl font-bold text-gray-900 transition-colors duration-300`}
              >
                Flamingo.ai
              </span>
            </a>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <nav className="hidden md:flex space-x-10">
            {["Blog", "FAQs", "Pricing"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-lg font-medium text-gray-500 hover:text-gray-900 transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex md:space-x-5 items-center justify-end md:flex-1 lg:w-0">
            <ViewDemo />
            <StartFreeTrial />
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {["Blog", "FAQs", "Pricing"].map((item) => (
            <a
              key={item}
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-5">
            <ViewDemo />
            <StartFreeTrial />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
