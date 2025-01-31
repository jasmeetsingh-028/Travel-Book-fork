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
                            <a href="https://travelbook.sahilportfolio.me/">
                                <img className="w-auto h-12" src={logo} alt="logo" />
                            </a>
                        </div>
                        <div className="hidden lg:flex lg:ml-auto lg:items-center lg:space-x-8 xl:space-x-12">
                            <a href="https://travelbook.sahilportfolio.me/login" className="text-base font-medium text-gray-900 hover:text-opacity-50">
                                Sign in
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <section id="hero" className="pt-12 pb-12 sm:pb-16 lg:pt-8">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-x-16 items-center">
                        {/* Mobile-first: Show image first on mobile */}
                        <div className="lg:hidden flex justify-center">
                            <img className="w-4/4 mx-auto no-drag" src={preview} alt="Preview of the Travel-Book" draggable="false" />
                        </div>

                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
                                Share Your Journey Today with <b>TravelBook</b>, Where Adventures are preserved!
                            </h1>
                            <p className="mt-2 text-lg text-gray-600 sm:mt-8">
                                Record your travels with TravelBook: where each place, image, and story is preserved forever.
                            </p>
                            <div className="mt-12 sm:mt-12">
                                <div className="relative group sm:rounded-xl">
                                    <div className="mt-4 sm:mt-0 sm:absolute sm:inset-y-0 sm:left-0 sm:flex sm:items-center sm:pl-2">
                                        <a href="https://travelbook.sahilportfolio.me/signUp" target="_blank" rel="noopener noreferrer" className="inline-flex px-6 py-3 text-lg font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-600">
                                            Create Free Account
                                        </a>
                                    </div>
                                    <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 flex items-center text-gray-600 mt-4 sm:mt-0">
                                        <span className="mx-2">OR</span>
                                    </div>
                                    <div className="mt-16 sm:mt-0 sm:absolute sm:inset-y-0 sm:right-0 sm:flex sm:items-center sm:pr-36">
                                        <a href="https://travelbook.sahilportfolio.me/login" target="_blank" rel="noopener noreferrer" className="inline-flex px-6 py-3 text-lg font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-600">
                                            Log In
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop: Show image next to the text */}
                        <div className="hidden lg:flex justify-center">
                            <img className="w-4/4 mx-auto no-drag" src={preview} alt="Preview of the Travel-Book" draggable="false" />
                        </div>
                    </div>
                </div>
            </section>

            <section id="about">
                <About />
            </section>

            <section id="how-it-works">
                <HowItWorks />
            </section>

            <section id="stats">
                <Stats />
            </section>

            <section id="footer">
                <Footer />
            </section>
        </div>
    );
};

export default Hero;
