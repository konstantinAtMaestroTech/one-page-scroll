import React from 'react';
import {motion, AnimatePresence } from 'framer-motion';
import { useActivePage } from '../hooks/useActivePage';
import { useIsMobile } from '../hooks/useIsMobile';

interface DesktopPageProps {
  pageIndex: number;
}

const DesktopFeatures: React.FC<DesktopPageProps> = ({pageIndex}) => {
  const isMobile = useIsMobile();
  
  return isMobile ? <DesktopFeaturesMobile pageIndex={pageIndex} /> : <DesktopFeaturesDesktop pageIndex={pageIndex} />
}

const DesktopFeaturesMobile: React.FC<DesktopPageProps> = ({pageIndex}) => {

  const { isActive, previousPage, setLockMainScroll, navigateToPage } = useActivePage({ pageIndex });
  const videoRef = React.useRef<HTMLVideoElement>(null);
  // State to track which feature is highlighted
  const [activeFeatureIndex, setActiveFeatureIndex] = React.useState(0);
  const [previousIndex, setPreviousIndex] = React.useState(0);
  // State to track if we're in feature navigation mode
  const [isInFeatureMode, setIsInFeatureMode] = React.useState(false);
  // Create a ref for the feature container
  const featureContainerRef = React.useRef<HTMLDivElement>(null);

  // Touch state for feature navigation
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
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

  React.useEffect(() => {
    if (!isInFeatureMode) {
      setLockMainScroll(false);
    }
  },[isInFeatureMode])

  // Add and remove scroll event listener
  React.useEffect(() => {
    const container = featureContainerRef.current;
    
    const wheelHandler = (e: WheelEvent) => handleFeatureScroll(e);
    
    if (container && isActive && isInFeatureMode) {
      container.addEventListener('wheel', wheelHandler, { passive: false });
      return () => {
        container.removeEventListener('wheel', wheelHandler);
      };
    }
  }, [isActive, isInFeatureMode]);

  React.useEffect(() => {
    setPreviousIndex(activeFeatureIndex);
  }, [activeFeatureIndex]);

  // Enter feature mode when the page becomes active
  React.useEffect(() => {
    if (isActive) {
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
  },[isActive]);

  const features = [
    {
      id: 0,
      title: 'Simplify project management',
      description: 'Fewer emails, fewer site visits - spend your time where it counts'
    },
    { 
      id: 1, 
      title: 'Real time tracking, wherever you are', 
      description: 'MaestroPilot is your digital boots on the ground: with live updates from the factory to the field.', 
      video: './videos/static-pc.mp4' 
    },
    { 
      id: 2, 
      title: 'Coordinate Complex Schedules', 
      description: 'Use our component-linked Gantt to track installation tasks and manage intricate sequences, ensuring every piece falls into place.', 
      video: './videos/static-pc.mp4' 
    },
    { 
      id: 3, 
      title: 'Generate Reports in a Click', 
      description: 'Easily produce status updates or PDFs for external stakeholders—no extra software required. ', 
      video: './videos/static-pc.mp4' 
    },
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "tween", duration: 0.4, ease: "easeIn" },
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: "tween", duration: 0.4, ease: "easeIn" },
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
                        className="grid grid-rows-3 w-full h-svh pt-20"
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
                            className='flex flex-col row-span-3 justify-center gap-3 pb-20'
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
                              className='row-span-2 relative flex justify-center items-center'
                            >
                              <div className='absolute inset-0 flex justify-center items-center'>
                                <video 
                                  ref={videoRef}
                                  loop
                                  muted
                                  playsInline
                                >
                                  <source src={features[activeFeatureIndex].video} type="video/webm" />
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

const DesktopFeaturesDesktop: React.FC<DesktopPageProps> = ({ pageIndex }) => {
  const { isActive, previousPage, setLockMainScroll, navigateToPage } = useActivePage({ pageIndex });
  const videoRef = React.useRef<HTMLVideoElement>(null);
  // State to track which feature is highlighted
  const [activeFeatureIndex, setActiveFeatureIndex] = React.useState(0);
  const [previousIndex, setPreviousIndex] = React.useState(0);
  // State to track if we're in feature navigation mode
  const [isInFeatureMode, setIsInFeatureMode] = React.useState(false);
  // Create a ref for the feature container
  const featureContainerRef = React.useRef<HTMLDivElement>(null);

  // Touch state for feature navigation
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
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

  React.useEffect(() => {
    if (!isInFeatureMode) {
      setLockMainScroll(false);
    }
  },[isInFeatureMode])

  // Add and remove scroll event listener
  React.useEffect(() => {
    const container = featureContainerRef.current;
    
    const wheelHandler = (e: WheelEvent) => handleFeatureScroll(e);
    
    if (container && isActive && isInFeatureMode) {
      container.addEventListener('wheel', wheelHandler, { passive: false });
      return () => {
        container.removeEventListener('wheel', wheelHandler);
      };
    }
  }, [isActive, isInFeatureMode]);

  React.useEffect(() => {
    setPreviousIndex(activeFeatureIndex);
  }, [activeFeatureIndex]);

  // Enter feature mode when the page becomes active
  React.useEffect(() => {
    if (isActive) {
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
  },[isActive]);

  const features = [
    { 
      id: 1, 
      title: 'Real time tracking, wherever you are', 
      description: 'MaestroPilot is your digital boots on the ground: with live updates from the factory to the field.', 
      video: './videos/static-pc.mp4' 
    },
    { 
      id: 2, 
      title: 'Coordinate Complex Schedules', 
      description: 'Use our component-linked Gantt to track installation tasks and manage intricate sequences, ensuring every piece falls into place.', 
      video: './videos/static-pc.mp4' 
    },
    { 
      id: 3, 
      title: 'Generate Reports in a Click', 
      description: 'Easily produce status updates or PDFs for external stakeholders—no extra software required. ', 
      video: './videos/static-pc.mp4' 
    },
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "tween", duration: 0.4, ease: "easeIn" },
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: "tween", duration: 0.4, ease: "easeIn" },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
      <AnimatePresence>
        {isActive && (
          <div 
            className='h-full w-full relative mt-[160px]'
            ref={featureContainerRef}
            onTouchStart={handleFeatureTouchStart}
            onTouchMove={handleFeatureTouchMove}
            onTouchEnd={handleFeatureTouchEnd}
          >
            <div className='flex w-full h-full'>
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
                      className="grid grid-rows-3 w-full h-full"
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
                      <div
                        className='row-span-2 relative flex justify-center items-center'
                      >
                        <div className='absolute inset-10 flex justify-center items-center'>
                          <video 
                            ref={videoRef}
                            className='h-full'
                            loop
                            muted
                            playsInline
                          >
                            <source src={features[activeFeatureIndex].video} type="video/webm" />
                          </video>
                        </div>
                      </div>
                      <div
                        className='flex flex-col h-fit'
                      >
                        <div
                          className='text-[#FF4300] font-bold text-4xl p-4 flex justify-center content-center'
                        >
                          {features[activeFeatureIndex].title}
                        </div>
                        <div
                          className='text-white font-semibold text-2xl p-4 flex justify-center content-center text-center'
                        >
                          {features[activeFeatureIndex].description}
                        </div>
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
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </AnimatePresence>
  );
};

export default DesktopFeatures;