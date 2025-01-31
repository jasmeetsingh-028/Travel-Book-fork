import React from 'react';

const Stats = () => {
    return (
        <section className="py-10 bg-gray-100 sm:py-16 lg:py-24">
            <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Numbers tell our story</h2>
                    <p className="mt-3 text-xl leading-relaxed text-gray-600 md:mt-8">A snapshot of the amazing places our users have explored and the memories they've created with us.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 mt-10 text-center lg:mt-24 sm:gap-x-8 md:grid-cols-3">
                    <div>
                        <h3 className="font-bold text-7xl">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600"> 50+ </span>
                        </h3>
                        <p className="mt-4 text-xl font-medium text-gray-900">Trips recorded</p>
                        <p className="text-base mt-0.5 text-gray-500">Capturing memories from all over the world</p>
                    </div>

                    <div>
                        <h3 className="font-bold text-7xl">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600"> 20+ </span>
                        </h3>
                        <p className="mt-4 text-xl font-medium text-gray-900">Images uploaded</p>
                        <p className="text-base mt-0.5 text-gray-500">Stunning photos from places around the globe</p>
                    </div>

                    <div>
                        <h3 className="font-bold text-7xl">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600"> 1 </span>
                        </h3>
                        <p className="mt-4 text-xl font-medium text-gray-900">Countries explored</p>
                        <p className="text-base mt-0.5 text-gray-500">By our community of avid travelers</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Stats;
