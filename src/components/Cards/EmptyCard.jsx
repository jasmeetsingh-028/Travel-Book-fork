import React from 'react';

const EmptyCard = ({ imgSrc, message }) => {
    return (
        <div className="flex flex-col items-center justify-center mt-20 ml-96">
            <img src={imgSrc} alt="No notes" className="w-24" />

            <p className="w-1/2 text-lg font-bold text-slate-700 text-center leading-7 mt-10">
                {message}
            </p>
        </div>
    );
};

export default EmptyCard;
