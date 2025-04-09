import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivePage } from '../hooks/useActivePage';
import { useIsMobile } from '../hooks/useIsMobile';

interface MobileFeaturesProps {
  pageIndex: number;
}

const MobileFeatures: React.FC<MobileFeaturesProps> = ({pageIndex}) => {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileFeaturesMobile pageIndex={pageIndex} /> : <MobileFeaturesDektop pageIndex={pageIndex} />
}

const MobileFeaturesMobile: React.FC<MobileFeaturesProps> = ({pageIndex}) => {

  const { isActive, previousPage, setLockMainScroll, navigateToPage } = useActivePage({ pageIndex, delay: 300 });
  const videoRef = React.useRef<HTMLVideoElement>(null);
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
          navigateToPage(pageIndex+1) // Unlock main scroll to allow moving to next page
          return prev;
        }
        // If we're at the beginning and scrolling backward, exit feature mode
        if (next < 0 && direction < 0) {
          navigateToPage(pageIndex-1) // Unlock main scroll to allow moving to previous page
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

  useEffect(() => {
    setPreviousIndex(activeFeatureIndex);
  }, [activeFeatureIndex]);

  // Enter feature mode when the page becomes active
  useEffect(() => {
    if (isActive) {
      // Short delay to avoid immediate activation
      setIsInFeatureMode(true);
      setLockMainScroll(true); // Lock main scroll when entering feature mode
      if (previousPage !== null) {
        if (previousPage < pageIndex) {
          // Coming from a previous page (scrolling down)
          setPreviousIndex(0);
          setActiveFeatureIndex(0);
        } else {
          // Coming from a next page (scrolling up)
          setPreviousIndex(features.length); // Set to length so it appears to come from after the last feature
        }
      }
    } else {
      setIsInFeatureMode(false);
    }
  }, [isActive]);

  const features = [
    {
      id: 0,
      title: 'Empower your crew',
      description: 'Accelerate on-site assmebly with construction data'
    },
    { 
      id: 1, 
      title: 'Identify Components & Track Status in One Tap',
      description: 'See the final install location at a glance, and log progress in real time—no missing parts, no guesswork.',
      video: './videos/mobile-features/identify-component.mp4' 
    },
    { 
      id: 2, 
      title: 'Interactive Instructions at Your Crew\'s Fingertip', 
      description: 'Provide step-by-step digital directions on any device. No more paper, no more rework.',
      video: './videos/mobile-features/interactive-detail.mp4' 
    },
    { 
      id: 3,
      title: 'Connect Data to Every Part', 
      description: 'Attach safety protocols, certifications, and specs directly to each component. Something wrong? Handle QC with component-linked chat.',
      video: './videos/mobile-features/attachment-download.mp4' 
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
    <div className="h-svh w-screen text-center text-white px-4">
      <AnimatePresence>
        {isActive && (
            <div
              className='h-svh w-full'
              ref={featureContainerRef}
              onTouchStart={handleFeatureTouchStart}
              onTouchMove={handleFeatureTouchMove}
              onTouchEnd={handleFeatureTouchEnd}
            >
              <AnimatePresence
                custom={activeFeatureIndex}
                mode="wait"
              >
                {isInFeatureMode && (
                  <div
                    className='flex w-full flex-col justify-center items-center'
                  >
                    <motion.div
                      key={features[activeFeatureIndex].id}
                      className="flex flex-col w-full h-svh pt-20"
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
                      {activeFeatureIndex === 0 ? (
                        <div
                          className='flex flex-col h-full justify-center gap-3 pb-20'
                        >
                          <div
                            className='text-[#FF4300] font-bold text-3xl px-4 flex text-left'
                          >
                            {features[activeFeatureIndex].title}
                          </div>
                          <div
                            className='text-white font-semibold text-3xl px-4 flex text-left'
                          >
                            {features[activeFeatureIndex].description}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            className='flex flex-col h-fit gap-3'
                          >
                            <div
                              className='text-white font-bold text-2xl px-4 flex justify-center content-center text-left'
                            >
                              {features[activeFeatureIndex].title}
                            </div>
                            <div
                              className='text-gray-600 font-semibold text-xl px-4 flex justify-center content-center text-left'
                            >
                              {features[activeFeatureIndex].description}
                            </div>
                          </div>
                          <div
                            className='flex h-full relative justify-center items-center'
                          >
                            <div className='absolute inset-8 flex justify-center items-center'>
                              <video 
                                ref={videoRef}
                                className='h-full'
                                loop
                                muted
                                playsInline
                              >
                                <source src={features[activeFeatureIndex].video} type="video/mp4" />
                              </video>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MobileFeaturesDektop: React.FC<MobileFeaturesProps> = ({ pageIndex }) => {
  const { isActive, previousPage, setLockMainScroll, navigateToPage } = useActivePage({ pageIndex, delay: 300 });
  const videoRef = React.useRef<HTMLVideoElement>(null);
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

  useEffect(() => {
    setPreviousIndex(activeFeatureIndex);
  }, [activeFeatureIndex]);

  // Enter feature mode when the page becomes active
  useEffect(() => {
    if (isActive) {
      // Short delay to avoid immediate activation
      setIsInFeatureMode(true);
      setLockMainScroll(true); // Lock main scroll when entering feature mode
      if (previousPage !== null) {
        if (previousPage < pageIndex) {
          // Coming from a previous page (scrolling down)
          setPreviousIndex(0);
          setActiveFeatureIndex(0);
        } else {
          // Coming from a next page (scrolling up)
          setPreviousIndex(features.length); // Set to length so it appears to come from after the last feature
        }
      }
    } else {
      setIsInFeatureMode(false);
    }
  }, [isActive]);

  const features = [
    { 
      id: 1, 
      title: 'Identify Components & Track Status in One Tap',
      description: 'See the final install location at a glance, and log progress in real time—no missing parts, no guesswork.',
      video: './videos/mobile-features/identify-component.mp4' 
    },
    { 
      id: 2, 
      title: 'Interactive Instructions at Your Crew\'s Fingertip', 
      description: 'Provide step-by-step digital directions on any device. No more paper, no more rework.',
      video: './videos/mobile-features/interactive-detail.mp4' 
    },
    { 
      id: 3,
      title: 'Connect Data to Every Part', 
      description: 'Attach safety protocols, certifications, and specs directly to each component. Something wrong? Handle QC with component-linked chat.',
      video: './videos/mobile-features/attachment-download.mp4' 
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
                  className="flex flex-col h-full w-full p-6 relative"
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
                  <div className="absolute inset-0 flex justify-center items-center">
                    <video 
                        ref={videoRef}
                        className="h-full w-auto max-w-full object-contain"
                        loop
                        muted
                        playsInline
                        autoPlay
                    >
                        <source src={features[activeFeatureIndex].video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                  </div>
                </motion.div>
              </div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileFeatures;