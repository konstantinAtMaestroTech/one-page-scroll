import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivePage } from '../hooks/useActivePage';

interface FeaturePageProps {
  pageIndex: number;
}

const MobileFeatures: React.FC<FeaturePageProps> = ({ pageIndex }) => {
  const { isActive, setLockMainScroll, navigateToPage } = useActivePage({ pageIndex, delay: 300 });
  
  // State to track which feature is highlighted
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  // State to track if we're in feature navigation mode
  const [isInFeatureMode, setIsInFeatureMode] = useState(false);
  // Create a ref for the feature container
  const featureContainerRef = useRef<HTMLDivElement>(null);

  // Touch state for feature navigation
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 30;

  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  // Handle wheel events for feature navigation
  const handleFeatureScroll = (event: WheelEvent) => {
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
        navigateToPage(pageIndex+1)
        return prev;
      }
      // If we're at the beginning and scrolling backward, exit feature mode
      if (next < 0 && direction < 0) {
        navigateToPage(pageIndex-1)
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
      return () => {
        container.removeEventListener('wheel', wheelHandler);
      };
    }
  }, [isActive, isInFeatureMode]);

  // Enter feature mode when the page becomes active
  useEffect(() => {
    if (isActive) {
      // Short delay to avoid immediate activation
      setIsInFeatureMode(true);
      setLockMainScroll(true); // Lock main scroll when entering feature mode
    } else {
      setIsInFeatureMode(false);
    }
  }, [isActive]);

  useEffect(() => {
    setPreviousIndex(activeFeatureIndex);
  }, [activeFeatureIndex]);

  const features = [
    { 
        id: 1, 
        title: 'Identify Components & Track Status in One Tap',
        description: 'See the final install location at a glance, and log progress in real time—no missing parts, no guesswork.',
        video: './videos/webm_transparency.webm' 
    },
    { 
        id: 2, 
        title: 'Interactive Instructions at Your Crew\'s Fingertip', 
        description: 'Provide step-by-step digital directions on any device. No more paper, no more rework.',
        video: './videos/webm_transparency.webm' 
    },
    { 
        id: 3,
        title: 'Connect Data to Every Part', 
        description: 'Attach safety protocols, certifications, and specs directly to each component. Something wrong? Handle QC with component-linked chat.',
        video: './videos/webm_transparency.webm' 
    }
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: {
        y: { type: "tween", duration: 0.4, ease: "easeIn" },
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction: number) => ({
      y: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        y: { type: "tween", duration: 0.4, ease: "easeIn" },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <div className="w-screen text-center text-white px-4">
      <AnimatePresence>
        {isActive && (
            <div
              className='grid grid-cols-2 w-full'
              ref={featureContainerRef}
              onTouchStart={handleFeatureTouchStart}
              onTouchMove={handleFeatureTouchMove}
              onTouchEnd={handleFeatureTouchEnd}
            >
              <div
                className='flex flex-col justify-center items-center'
              >
                <div className="overflow-hidden w-full">
                  <div className="flex flex-col h-[500px]">
                    {features.map((item, index) => (
                      <motion.div
                        key={index}
                        className={`relative cursor-pointer p-4`}
                        layout
                        animate={{
                          flex: activeFeatureIndex === index ? 2 : 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        <motion.h3
                          className={`font-bold transition-colors text-3xl text-left duration-300 ${
                            activeFeatureIndex === index ? "text-[#FF4300]" : "text-gray-600"
                          }`}
                          layout="position"
                        >
                          {item.title}
                        </motion.h3>

                        <AnimatePresence>
                          {activeFeatureIndex === index && (
                            <motion.p
                              className="text-white text-2xl text-left mt-2"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{
                                opacity: { duration: 0.2 },
                                height: { duration: 0.3 },
                              }}
                            >
                              {item.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
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
              </div>
              <div className='flex justify-center items-center'>
                <motion.div
                  key={features[activeFeatureIndex].id}
                  className="flex flex-col p-6"
                  custom={activeFeatureIndex >= previousIndex ? 1 : -1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "tween", duration: 0.4, ease: "easeIn" }}
                  onAnimationComplete={() => {
                    if (videoRef.current) {
                      videoRef.current.play().catch(err => 
                        console.error("Video autoplay failed:", err)
                      );
                    }
                  }}
                >
                  <video 
                      ref={videoRef}
                      className='max-h-full max-w-full object-contain'
                      loop
                      muted
                      playsInline
                      autoPlay
                  >
                      <source src={features[activeFeatureIndex].video} type="video/webm" />
                      Your browser does not support the video tag.
                  </video>
                </motion.div>
              </div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileFeatures;