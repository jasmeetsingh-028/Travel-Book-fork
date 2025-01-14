import React from 'react';
import { Link } from 'react-scroll';
import { Helmet } from 'react-helmet'; // Import Helmet
import logo from '../../assets/images/logo.png';
import preview from '../../assets/images/preview.png';
import HowItWorks from './HowItWorks';
import Stats from './Stats';
import About from './About';
import Footer from './Footer';

const Hero = () => {
    return (
        <div className="bg-gray-50">
            {/* Add the Helmet component here */}
            <Helmet>
                <meta name="description" content="Travel-Book: A platform to share your travel stories and experiences with the world. Join and start sharing your adventures!" />
                <meta name="keywords" content="travel, stories, travel blog, share experiences, adventure, travel book, travel journal" />
                <meta name="author" content="Your Name or Company" />

                {/* Open Graph Meta Tags */}
                <meta property="og:title" content="Travel-Book: Share Your Travel Stories" />
                <meta property="og:description" content="A platform for travelers to document and share their journeys. Join now to share your adventures!" />
                <meta property="og:image" content="https://raw.githubusercontent.com/Sahilll94/Travel-Book/main/src/assets/images/meta.png" />
                <meta property="og:url" content="https://travelbook.sahilportfolio.me/" />
                <meta property="og:type" content="website" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Travel-Book: Share Your Travel Stories" />
                <meta name="twitter:description" content="A platform for travelers to document and share their journeys. Join now to share your adventures!" />
                <meta name="twitter:image" content="https://raw.githubusercontent.com/Sahilll94/Travel-Book/main/src/assets/images/meta.png" />
            </Helmet>

            <header className="py-4 md:py-6">
                <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex-shrink-0">
                            <Link
                                to="hero"
                                smooth={true}
                                duration={500}
                                offset={-50} // Adjust the scroll position a little
                                className="flex rounded outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                            >
                                <img className="w-auto h-12" src={logo} alt="logo" />
                            </Link>
                        </div>
                        {/* Mobile Hamburger Icon */}
                        <div className="flex lg:hidden">
                            <button type="button" className="text-gray-900">
                                <svg
                                    className="w-7 h-7"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </button>
                        </div>

                        {/* Navbar items - Desktop */}
                        <div className="hidden lg:flex lg:ml-10 xl:ml-16 lg:items-center lg:justify-center lg:space-x-8 xl:space-x-16">
                            <Link
                                to="about"
                                smooth={true}
                                duration={500}
                                offset={-50}
                                className="cursor-pointer text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                            >
                                About Travel-Book
                            </Link>

                            <Link
                                to="how-it-works"
                                smooth={true}
                                duration={500}
                                offset={-50}
                                className="cursor-pointer text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                            >
                                How does it work?
                            </Link>

                            <Link
                                to="services"
                                smooth={true}
                                duration={500}
                                offset={-50}
                                className="cursor-pointer text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                            >
                                Our Services
                            </Link>
                        </div>

                        {/* Navbar items - Mobile */}
                        <div className="hidden lg:flex lg:ml-auto lg:items-center lg:space-x-8 xl:space-x-10">
                            <a
                                href="https://travelbook.sahilportfolio.me/login"  // Updated link to the login page
                                className="cursor-pointer text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                            >
                                Sign in
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section id="hero" className="pt-12 pb-12 sm:pb-16 lg:pt-8">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
                        <div>
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:leading-tight lg:text-6xl font-pj">
                                    Share Your Journey Today with <b>TravelBook</b>, Where Adventures are preserved!
                                </h1>
                                <p className="mt-2 text-lg text-gray-600 sm:mt-8 font-inter">
                                    Record your travels with TravelBook: where each place, image, and story is preserved forever.
                                </p>

                                {/* New button above the original button */}
                                <div className="mt-4 sm:mt-24">
                                    <div className="relative group sm:rounded-xl">
                                        <div className="mt-4  sm:mt-0 sm:absolute sm:inset-y-0 sm:left-0 sm:flex sm:items-center sm:pl-2">
                                            <a
                                                href="https://travelbook.sahilportfolio.me/signUp" //SIGN UP LINK HERE
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex px-6 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 rounded-lg focus:outline-none focus:bg-gray-600 font-pj hover:bg-gray-600"
                                            >
                                                Create Free Account
                                            </a>
                                        </div>

                                        <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 flex items-center text-gray-600 font-inter">
                                            <span className='mx-2'>OR</span>
                                        </div>

                                        <div className="mt-4 sm:mt-0 sm:absolute sm:inset-y-0 sm:right-0 sm:flex sm:items-center sm:pr-36">
                                            <a
                                                href="https://travelbook.sahilportfolio.me/login" // Log in link
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex px-6 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 rounded-lg focus:outline-none focus:bg-gray-600 font-pj hover:bg-gray-600"
                                            >
                                                Log In
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-center mt-52 space-x-6 lg:justify-start sm:space-x-8">
                                <div className="flex items-center">
                                    <p className="text-3xl font-medium text-gray-900 sm:text-4xl font-pj">294</p>
                                    <p className="ml-3 text-sm text-gray-900 font-pj">
                                        Memories
                                        <br /> Delivered
                                    </p>
                                </div>

                                <div className="hidden sm:block">
                                    <svg
                                        className="text-gray-400"
                                        width="16"
                                        height="39"
                                        viewBox="0 0 16 39"
                                        fill="none"
                                        stroke="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <line x1="0.72265" y1="10.584" x2="15.7226" y2="0.583975"></line>
                                        <line x1="0.72265" y1="17.584" x2="15.7226" y2="7.58398"></line>
                                        <line x1="0.72265" y1="24.584" x2="15.7226" y2="14.5839"></line>
                                        <line x1="0.72265" y1="31.584" x2="15.7226" y2="21.5839"></line>
                                    </svg>
                                </div>

                                <div className="flex items-center">
                                    <p className="text-3xl font-medium text-gray-900 sm:text-4xl font-pj">432</p>
                                    <p className="ml-3 text-sm text-gray-900 font-pj">
                                        Active Users
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative max-w-md mx-auto sm:max-w-3xl lg:max-w-none sm:w-full">
                            <img
                                className="object-cover object-center rounded-lg shadow-xl sm:rounded-xl lg:rounded-3xl"
                                src={preview}
                                alt="travel-book"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <HowItWorks />
            <Stats />
            <About />
            <Footer />
        </div>
    );
};

export default Hero;
