import React from "react";
import { Link } from "react-scroll";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <div className="flex-shrink-0">
            <img className="w-20 h-20" src={logo} alt="logo" />
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h4 className="text-lg font-medium text-gray-200">About</h4>
              <ul className="mt-4">
                <li>
                  <Link
                    to="about"
                    smooth={true}
                    duration={500}
                    offset={-50}
                    className="cursor-pointer text-gray-400 hover:text-white transition-all duration-200"
                  >
                    About Travel-Book
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-200">Implementation</h4>
              <ul className="mt-4">
                <li>
                  <Link
                    to="how-it-works"
                    smooth={true}
                    duration={500}
                    offset={-50}
                    className="cursor-pointer text-gray-400 hover:text-white transition-all duration-200"
                  >
                    How does it work?
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-200">Our Services</h4>
              <ul className="mt-4">
                <li>
                  <Link
                    to="services"
                    smooth={true}
                    duration={500}
                    offset={-50}
                    className="cursor-pointer text-gray-400 hover:text-white transition-all duration-200"
                  >
                    Our Services
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-200">Statistics</h4>
              <ul className="mt-4">
                <li>
                  <Link
                    to="stats"
                    smooth={true}
                    duration={500}
                    offset={-50}
                    className="cursor-pointer text-gray-400 hover:text-white transition-all duration-200"
                  >
                    Statistics
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2025 TravelBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
