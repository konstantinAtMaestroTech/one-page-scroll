import React from 'react';
import { motion } from 'framer-motion';
import { NavigationDotsProps } from './types';

const NavigationDots: React.FC<NavigationDotsProps> = ({ 
  pages, 
  currentPage, 
  navigateToPage 
}) => {
  // Animation for the navigation container
  const navContainerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.7
      }
    }
  };

  // Animation for each dot
  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="fixed right-5 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-4"
      variants={navContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {pages.map((page, index) => (
        <motion.button 
          key={page.id}
          className={`w-3 h-3 rounded-full transition-colors duration-300 ${
            index === currentPage 
              ? 'bg-white' 
              : 'bg-white bg-opacity-50 hover:bg-opacity-75'
          }`}
          variants={dotVariants}
          whileHover={{ scale: 1.5 }}
          whileTap={{ scale: 0.9 }}
          animate={index === currentPage ? { scale: 1.5 } : { scale: 1 }}
          onClick={() => navigateToPage(index)}
          aria-label={`Go to page ${index + 1}`}
        />
      ))}
    </motion.div>
  );
};

export default NavigationDots;