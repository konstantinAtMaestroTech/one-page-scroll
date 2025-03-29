import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/animated-section';
import { useActivePage } from '../hooks/useActivePage';

interface HomePageProps {
  pageIndex: number;
}

const HomePage: React.FC<HomePageProps> = ({ pageIndex }) => {
  const { isActive } = useActivePage({ pageIndex });

  return (
      <AnimatePresence>
        {isActive && (
          <div className='h-screen w-screen grid grid-rows-2'>
            <AnimatedSection
              direction='left'
              duration={1}
              delay={0.2}
              className='px-10 h-full w-full flex items-center'
            >
              <h1 className="text-6xl text-white font-bold mb-6">MPower: the power of digital on your construction site</h1>
            </AnimatedSection>
            <div className='grid grid-cols-2'>
              <div>
                
              </div>
              <div className="flex flex-col p-6">
                <AnimatedSection delay={0.2} direction="up">
                  <p className="text-4xl text-white font-bold mb-8">
                    Real Time ground truth for your prefabricated build
                  </p>
                </AnimatedSection>
                
                <AnimatedSection delay={0.4} direction="up">
                  <motion.button 
                    className="bg-[#FF4300] text-white font-semibold py-2 px-6 rounded-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    BOOK A DEMO
                  </motion.button>
                </AnimatedSection>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
  );
};

export default HomePage;