import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/animated-section';
import { useActivePage } from '../hooks/useActivePage';

interface FeaturePageProps {
  pageIndex: number;
}

const FeaturePage: React.FC<FeaturePageProps> = ({ pageIndex }) => {
  const { isActive, setLockMainScroll } = useActivePage({ pageIndex, delay: 300 });
  
  // State to track which feature is highlighted
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  // State to track if we're in feature navigation mode
  const [isInFeatureMode, setIsInFeatureMode] = useState(false);
  // Create a ref for the feature container
  const featureContainerRef = useRef<HTMLDivElement>(null);

  // Touch state for feature navigation
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 30;
  
  // Handle wheel events for feature navigation
  const handleFeatureScroll = (event: WheelEvent) => {
    console.log('the feature scroll has been handled')
    if (!isActive || !isInFeatureMode) return;
    
    event.preventDefault();
    
    // Determine scroll direction
    const direction = event.deltaY > 0 ? 1 : -1;
    
    // Update active feature index
    setActiveFeatureIndex(prev => {
      const next = prev + direction;
      // If we're at the end and scrolling forward, exit feature mode
      if (next >= features.length && direction > 0) {
        setIsInFeatureMode(false);
        return prev;
      }
      // If we're at the beginning and scrolling backward, exit feature mode
      if (next < 0 && direction < 0) {
        setIsInFeatureMode(false);
        return prev;
      }
      // Otherwise, update within bounds
      return Math.max(0, Math.min(next, features.length - 1));
    });
  };

  const handleFeatureTouchStart = (e: React.TouchEvent) => {
    if (!isActive || !isInFeatureMode) return;
    setTouchStart(e.targetTouches[0].clientY);
    setTouchEnd(null);
  };
  
  const handleFeatureTouchMove = (e: React.TouchEvent) => {
    if (!isActive || !isInFeatureMode) return;
    setTouchEnd(e.targetTouches[0].clientY);
  };
  
  const handleFeatureTouchEnd = () => {
    if (!isActive || !isInFeatureMode || !touchStart || !touchEnd) return;
    
    // Calculate distance and direction of the swipe
    const distance = touchStart - touchEnd;
    const isSignificantSwipe = Math.abs(distance) >= minSwipeDistance;
    
    if (isSignificantSwipe) {
      // Positive distance means swipe up (show next feature)
      const direction = distance > 0 ? 1 : -1;
      
      // Update active feature index
      setActiveFeatureIndex(prev => {
        const next = prev + direction;
        // If we're at the end and scrolling forward, exit feature mode
        if (next >= features.length && direction > 0) {
          setIsInFeatureMode(false);
          setLockMainScroll(false); // Unlock main scroll to allow moving to next page
          return prev;
        }
        // If we're at the beginning and scrolling backward, exit feature mode
        if (next < 0 && direction < 0) {
          setIsInFeatureMode(false);
          setLockMainScroll(false); // Unlock main scroll to allow moving to previous page
          return prev;
        }
        // Otherwise, update within bounds
        return Math.max(0, Math.min(next, features.length - 1));
      });
    }
    
    // Reset touch coordinates
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    if (!isInFeatureMode) {
      setLockMainScroll(false);
    }
  },[isInFeatureMode])

  // Add and remove scroll event listener
  useEffect(() => {
    const container = featureContainerRef.current;
    
    const wheelHandler = (e: WheelEvent) => handleFeatureScroll(e);
    
    if (container && isActive && isInFeatureMode) {
      container.addEventListener('wheel', wheelHandler, { passive: false });
      console.log('the event Listener has been added')
      return () => {
        container.removeEventListener('wheel', wheelHandler);
        console.log('the event Listener has been removed')
      };
    }
  }, [isActive, isInFeatureMode]);

  // Enter feature mode when the page becomes active
  useEffect(() => {
    if (isActive) {
      // Short delay to avoid immediate activation
      console.log('we are about to reset the active feature index')
      const timer = setTimeout(() => {
        setIsInFeatureMode(true);
        setActiveFeatureIndex(0);
        setLockMainScroll(true); // Lock main scroll when entering feature mode
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setIsInFeatureMode(false);
      setLockMainScroll(false); // Unlock main scroll when leaving page
    }
  }, [isActive]);

  // flags
  useEffect(() => {
    console.log('isActive is',isActive)
  },[isActive])

  useEffect(() => {
    console.log('isInFeatureMode is',isInFeatureMode)
  },[isInFeatureMode])

  const features = [
    { id: 1, title: 'Responsive Design', description: 'Works on all devices and screen sizes' },
    { id: 2, title: 'TypeScript Support', description: 'Fully typed for better development experience' },
    { id: 3, title: 'Smooth Transitions', description: 'Beautiful scroll-based page transitions' }
  ];

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="text-center text-white max-w-5xl px-4">
      <AnimatePresence>
        {isActive && (
          <>
            <AnimatedSection>
              <h2 className="text-5xl font-bold mb-6">Key Features</h2>
            </AnimatedSection>
            
            {isInFeatureMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-xl text-black mb-6 bg-white bg-opacity-10 py-2 px-4 rounded-lg inline-block"
              >
                <span className="mr-2">📌</span>
                Scroll to navigate through features {activeFeatureIndex + 1}/{features.length}
                {activeFeatureIndex === features.length - 1 && (
                  <span className="ml-2 text-sm">(Scroll down to continue to next page)</span>
                )}
                {activeFeatureIndex === 0 && (
                  <span className="ml-2 text-sm">(Scroll up to return to previous page)</span>
                )}
              </motion.div>
            )}
            
            <div 
              ref={featureContainerRef} 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
              onTouchStart={handleFeatureTouchStart}
              onTouchMove={handleFeatureTouchMove}
              onTouchEnd={handleFeatureTouchEnd}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.id} 
                  className={`bg-white text-black bg-opacity-20 rounded-lg p-6 backdrop-blur-sm transition-all duration-500 relative
                            ${isInFeatureMode && index !== activeFeatureIndex ? 'opacity-30 scale-95 blur-sm' : ''}`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ 
                    scale: isInFeatureMode && index !== activeFeatureIndex ? 1.0 : 1.05,
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p>{feature.description}</p>
                  
                  {isInFeatureMode && index === activeFeatureIndex && (
                    <motion.div 
                      className="absolute inset-0 border-2 border-white rounded-lg pointer-events-none"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
            
            {isInFeatureMode && (
              <div className="flex justify-center mt-8 space-x-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeFeatureIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
                    }`}
                    onClick={() => setActiveFeatureIndex(index)}
                    aria-label={`View feature ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeaturePage;