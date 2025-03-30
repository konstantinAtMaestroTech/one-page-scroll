import React from 'react';
import { motion } from 'framer-motion';
import { useActivePage } from '../hooks/useActivePage';

interface HeaderProps {
  logoSrc?: string;
}

const Header: React.FC<HeaderProps> = ({ logoSrc = "/logo.svg" }) => {
  const { activePage } = useActivePage({ pageIndex: 0 });
  const isHomePage = activePage === 0;
  
  // Function to navigate to a specific page
  const navigateToPage = (pageIndex: number) => {
    // This would be implemented with the navigation API from FullPageScroll
    // For now, we'll use anchor links
    const element = document.getElementById(`page-${pageIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Header animation variants
  const headerVariants = {
    expanded: {
      height: "120px",
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    collapsed: {
      height: "80px", 
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  // Logo animation variants
  const logoVariants = {
    expanded: {
      scale: 1.4,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    collapsed: {
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-8"
      initial="expanded"
      animate={isHomePage ? "expanded" : "collapsed"}
      variants={headerVariants}
    >
      {/* Logo */}
      <motion.div 
        className="flex items-center cursor-pointer"
        variants={logoVariants}
        onClick={() => navigateToPage(0)}
        whileHover={{ scale: isHomePage ? 1.45 : 1.05 }}
        whileTap={{ scale: isHomePage ? 1.4 : 1 }}
      >
        <img 
          src={logoSrc} 
          alt="Company Logo" 
          className="h-12 w-auto"
        />
      </motion.div>
      
    </motion.header>
  );
};

export default Header;