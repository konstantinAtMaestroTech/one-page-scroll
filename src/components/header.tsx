import React from 'react';
import { motion } from 'framer-motion';
import { useActivePage } from '../hooks/useActivePage';
import AnimatedSection from './animated-section';
import { MoveRight } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface HeaderProps {
  logoSrc?: string;
}

const Header: React.FC<HeaderProps> = ({ logoSrc = "/logo.svg" }) => {
  const { activePage, navigateToPage } = useActivePage({ pageIndex: 0 });
  const isMobile = useIsMobile();
  const isHomePage = activePage === 0;
  const isSpecialPage = activePage === 5;
  
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

  // Button color variants for the delayed color change
  const buttonColorVariants = {
    default: {
      borderColor: "#FF4300",
      color: "#FF4300",
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    special: {
      borderColor: "white",
      color: "white",
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      }
    }
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12"
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
          className="flex h-12 w-auto "
        />
      </motion.div>
      <AnimatedSection 
        delay={0.4} 
        direction="up"
        className='flex gap-2'
      >
        <motion.a
          href="https://construction-data-hub.vercel.app"
          className="flex w-full justify-between border-2 bg-transparent font-semibold py-1 md:py-2 px-3 md:px-6 rounded-full text-sm md:text-base"
          initial="default"
          animate={isSpecialPage ? "special" : "default"}
          variants={buttonColorVariants}
          whileHover={{ 
            scale: 1.05, 
            background: isSpecialPage ? "white" : "#FF4300", 
            color: isSpecialPage ? "#FF4300" : "white",
            borderColor: isSpecialPage ? "white" : "#FF4300"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Log In
        </motion.a>
        <motion.button 
          className="flex w-full whitespace-nowrap justify-between gap-2 md:gap-4 border-2 bg-transparent font-semibold py-1 md:py-2 px-3 md:px-6 rounded-full text-sm md:text-base"
          initial="default"
          animate={isSpecialPage ? "special" : "default"}
          variants={buttonColorVariants}
          whileHover={{ 
            scale: 1.05, 
            background: isSpecialPage ? "white" : "#FF4300", 
            color: isSpecialPage ? "#FF4300" : "white",
            borderColor: isSpecialPage ? "white" : "#FF4300"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={() => navigateToPage(6)}
        >
          Get Started
          {!isMobile && <MoveRight size={18} />}
        </motion.button>
      </AnimatedSection>
    </motion.header>
  );
};

export default Header;