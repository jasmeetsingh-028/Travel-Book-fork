import React from 'react';
import { motion } from 'framer-motion';
import { MdAddCircleOutline } from 'react-icons/md';

const EmptyCard = ({ imgSrc, message, onAddClick }) => {
  return (
    <motion.div 
      className='p-6 sm:p-8 flex flex-col items-center justify-center max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <motion.div 
        className='w-full max-w-[250px] mx-auto'
        animate={{ y: [0, -8, 0] }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "reverse", 
          duration: 2.5,
          ease: "easeInOut" 
        }}
      >
        <img 
          src={imgSrc} 
          alt='Empty state illustration'
          className='w-full h-auto object-contain'
          loading="lazy"
        />
      </motion.div>
      
      <div className='text-center mt-6'>
        <motion.h3 
          className='text-lg font-medium text-gray-800 dark:text-white mb-2'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          No Stories Found
        </motion.h3>
        
        <motion.p 
          className='text-sm text-gray-500 dark:text-gray-400 mb-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {message}
        </motion.p>
        
        {onAddClick && typeof onAddClick === 'function' && (
          <motion.button
            className='inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-full transition-colors duration-200'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            onClick={() => onAddClick()}
          >
            <MdAddCircleOutline className="text-lg" />
            <span>Add Your First Story</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default EmptyCard;
