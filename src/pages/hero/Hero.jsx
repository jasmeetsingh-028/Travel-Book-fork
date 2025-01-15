import React from "react";
import { Link } from "react-scroll";
import logo from "../../assets/images/logo.png";
import preview from "../../assets/images/preview.png";
import HowItWorks from "./HowItWorks";
import Stats from "./Stats";
import About from "./About";
import Footer from "./Footer";

const Hero = () => {
    return (
        <div className="bg-gray-50">
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
                                <a href ="https://travelbook.sahilportfolio.me/">
                                <img className="w-auto h-12" src={logo} alt="logo" />
                                    </a>
                            </Link>
                        </div>

                        {/* Mobile Hamburger Icon */}
                        {/* <div className="flex lg:hidden">
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
                        </div> */}

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
                                href="https://travelbook.sahilportfolio.me/login" // Updated link to the login page
                                className="cursor-pointer text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                            >
                                Sign in
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <section id="hero" className="pt-12 pb-12 sm:pb-16 lg:pt-8">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
                        <div>
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:leading-tight lg:text-6xl font-pj">
                                    Share Your Journey Today with <b>TravelBook</b>, Where
                                    Adventures are preserved!
                                </h1>
                                <p className="mt-2 text-lg text-gray-600 sm:mt-8 font-inter">
                                    Record your travels with TravelBook: where each place, image,
                                    and story is preserved forever.
                                </p>

                                {/* New button above the original button */}
                                <div className="mt-12 sm:mt-12 ">
                                    <div className="relative group sm:rounded-xl">
                                        <div className="mt-4 sm:mt-0 sm:absolute sm:inset-y-0 sm:left-0 sm:flex sm:items-center sm:pl-2 z-20">
                                            <a
                                                href="https://travelbook.sahilportfolio.me/signUp" // SIGN UP LINK HERE
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex px-6 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 rounded-lg focus:outline-none focus:bg-gray-600 font-pj hover:bg-gray-600"
                                            >
                                                Create Free Account
                                            </a>
                                        </div>

                                        <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 flex items-center text-gray-600 font-inter mt-4 sm:mt-0 z-20">
                                            <span className="mx-2">OR</span>
                                        </div>

                                        <div className="mt-16 sm:mt-0 sm:absolute sm:inset-y-0 sm:right-0 sm:flex sm:items-center sm:pr-36 z-20">
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

                            <div className="flex items-center justify-center mt-40 space-x-6 lg:justify-start sm:space-x-8">
                                <div className="flex items-center">
                                    <p className="text-3xl font-medium text-gray-900 sm:text-4xl font-pj">
                                        294
                                    </p>
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
                                        <line
                                            x1="0.72265"
                                            y1="10.584"
                                            x2="15.7226"
                                            y2="0.583975"
                                        ></line>
                                        <line
                                            x1="0.72265"
                                            y1="17.584"
                                            x2="15.7226"
                                            y2="7.58398"
                                        ></line>
                                        <line
                                            x1="0.72265"
                                            y1="24.584"
                                            x2="15.7226"
                                            y2="14.584"
                                        ></line>
                                        <line
                                            x1="0.72265"
                                            y1="31.584"
                                            x2="15.7226"
                                            y2="21.584"
                                        ></line>
                                        <line
                                            x1="0.72265"
                                            y1="38.584"
                                            x2="15.7226"
                                            y2="28.584"
                                        ></line>
                                    </svg>
                                </div>

                                <div className="flex items-center">
                                    <p className="text-3xl font-medium text-gray-900 sm:text-4xl font-pj">
                                        400+
                                    </p>
                                    <p className="ml-3 text-sm text-gray-900 font-pj">
                                        Happy
                                        <br /> Traveller
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <img
                                className="w-4/4 mx-auto"
                                src={preview}
                                alt="Preview of the Product"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white px-6">Hey Travellers!</span>
            </span>

            <section id="about">
                <About />
            </section>

            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white px-6">How is it going?</span>
            </span>

            <section id="how-it-works">
                <HowItWorks />
            </section>

            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white px-6">How have you been?</span>
            </span>

            <section id="services">
                <div className="py-12">
                    <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
                            <p className="mt-4 text-lg text-gray-600">
                                TravelBook offers a range of services to make documenting your
                                travels easy and enjoyable:
                            </p>
                        </div>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {/* Service Cards */}
                            <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
                                <img
                                    alt="Travel Logging"
                                    src="https://images.pexels.com/photos/2108813/pexels-photo-2108813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    className="w-full h-72 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Travel Logging
                                    </h3>
                                    <p className="mt-2 text-base text-gray-600">
                                        Record each step of your journey with rich media and
                                        detailed entries.
                                    </p>
                                </div>
                            </article>
                            <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
                                <img
                                    alt="Travel Sharing"
                                    src="https://images.pexels.com/photos/1194233/pexels-photo-1194233.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    className="w-full h-72 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Travel Sharing
                                    </h3>
                                    <p className="mt-2 text-base text-gray-600">
                                        Share your journeys with friends and family instantly with
                                        TravelBook.
                                    </p>
                                </div>
                            </article>
                            <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
                                <img
                                    alt="Travel Collaboration"
                                    src="https://images.pexels.com/photos/1255062/pexels-photo-1255062.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    className="w-full h-72 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Travel Collaboration
                                    </h3>
                                    <p className="mt-2 text-base text-gray-600">
                                        Collaborate on travel logs with fellow travelers to share
                                        your experiences.
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white px-6">
                    Oh, So do you like the design?
                </span>
            </span>

            <section id="stats">
                <Stats />
            </section>

            <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white px-6">
                    Sign in to save your memories!
                </span>
            </span>

            <section id="footer">
                <Footer />
            </section>
        </div>
    );
};

export default Hero;
