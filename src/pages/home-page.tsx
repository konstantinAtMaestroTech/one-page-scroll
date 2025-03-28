import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/animated-section';
import { useActivePage } from '../hooks/useActivePage';

interface HomePageProps {
  pageIndex: number;
}

const HomePage: React.FC<HomePageProps> = ({ pageIndex }) => {
  const { isActive } = useActivePage({ pageIndex });

  React.useEffect(()=>{
   if (isActive) console.log('the home page is active')
  },[isActive])

  return (
    <div className="text-center text-white max-w-4xl px-4">
      <AnimatePresence>
        {isActive && (
          <>
            <AnimatedSection>
              <h1 className="text-6xl font-bold mb-6">Welcome to Our App</h1>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2} direction="up">
              <p className="text-xl mb-8">
                A modern single page application with smooth scrolling transitions
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.4} direction="up">
              <motion.button 
                className="bg-white text-blue-500 font-semibold py-2 px-6 rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Get Started
              </motion.button>
            </AnimatedSection>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;