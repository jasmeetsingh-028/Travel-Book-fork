import React from 'react';

const EmptyCard = ({ imgSrc, message }) => {
    return (
       <div className="flex flex-col items-center justify-center mt-10 md:mt-20 mx-4 md:ml-96"> {/* Adjusted margins */}
  <img src={imgSrc} alt="No notes" className="w-20 md:w-24" />
  <p className="w-full md:w-1/2 text-base md:text-lg font-bold text-slate-700 text-center leading-7 mt-6 md:mt-10">
    {message}
  </p>
</div>
    );
};

export default EmptyCard;



