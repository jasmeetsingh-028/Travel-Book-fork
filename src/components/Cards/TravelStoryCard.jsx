import moment from 'moment/moment';
import React from 'react'
import {FaHeart} from "react-icons/fa6";
import {GrMapLocation} from "react-icons/gr"
import { motion } from 'framer-motion';

const TravelStoryCard = ({imgUrl,
    title,
    date,
    story,  
    visitedLocation,
    isFavourite,
    onFavouriteClick,
    onClick, }) => {
  return (
    <motion.div 
      className='border rounded-lg overflow-hidden bg-white dark:bg-gray-800 hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-gray-900/60 transition-all ease-in-out relative cursor-pointer'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
        <img src={imgUrl} alt={title} className='w-full h-56 object-cover rounded-lg' onClick={onClick} />

        <motion.button 
          className='w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4' 
          onClick={onFavouriteClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
            <FaHeart className={`icon-btn ${isFavourite ? "text-red-500" : "text-white"}`}/>
        </motion.button>

        <div className='p-4 dark:text-white' onClick={onClick}>
            <div className='flex items-center gap-3'>
                <div className='flex-1'>
                    <h6 className='text-sm font-medium'>{title}</h6>
                    <span className='text-xs text-slate-500 dark:text-slate-400'>
                        {date ? moment(date).format("Do MMM YYYY") : "-"}
                    </span>
                </div>
            </div>

            <p className='text-xs text-slate-600 dark:text-slate-300 mt-2'>{story?.slice(0,60)}</p>

            <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 dark:text-cyan-400 bg-cyan-200/40 dark:bg-cyan-900/40 rounded mt-3 px-2 py-1'>
                <GrMapLocation className='text-sm'/>
                {visitedLocation.map((item,index) => visitedLocation.length == index+1 ? `${item}`: `${item},`
                )}
            </div>
        </div>
    </motion.div>
  )
}

export default TravelStoryCard