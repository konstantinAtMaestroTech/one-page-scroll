import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/animated-section';
import { useActivePage } from '../hooks/useActivePage';

interface AboutPageProps {
  pageIndex: number;
}

const AboutPage: React.FC<AboutPageProps> = ({ pageIndex }) => {
  const { isActive } = useActivePage({ pageIndex, delay: 300 });

  // Animation for text reveal
  const textVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08 
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const sentence = "We're a team of passionate developers building next-generation web experiences.";
  const letters = Array.from(sentence);

  return (
    <div className="text-center text-white max-w-3xl px-4">
      <AnimatePresence>
        {isActive && (
          <>
            <AnimatedSection>
              <h2 className="text-5xl font-bold mb-8">About Us</h2>
            </AnimatedSection>
            
            <motion.p 
              className="text-xl mb-6 flex flex-wrap justify-center"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              {letters.map((letter, index) => (
                <motion.span key={index} variants={letterVariants}>
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.p>
            
            <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
              <AnimatedSection direction="left" delay={0.3}>
                <motion.div 
                  className="w-64 h-64 mx-auto md:mx-0 bg-white bg-opacity-10 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 360, scale: 1.05 }}
                  transition={{ duration: 1, type: "spring" }}
                >
                  <span className="text-5xl">🚀</span>
                </motion.div>
              </AnimatedSection>
              
              <AnimatedSection direction="right" delay={0.5}>
                <div className="text-left">
                  <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                  <p className="mb-4">
                    To create beautiful, performant, and accessible web applications that deliver
                    extraordinary user experiences.
                  </p>
                  <p>
                    Founded in 2023, we've been at the forefront of modern web development
                    techniques and best practices.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutPage;