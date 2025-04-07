import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/animated-section';
import { useActivePage } from '../hooks/useActivePage';
import { useIsMobile } from '../hooks/useIsMobile';

interface KeyPointsProps {
  pageIndex: number;
}

const KeyPoints: React.FC<KeyPointsProps> = ({pageIndex}) => {
  const isMobile = useIsMobile();
  return isMobile ? <KeyPointsMobile pageIndex={pageIndex}/> : <KeyPointsDesktop pageIndex={pageIndex}/>
}

const KeyPointsMobile: React.FC<KeyPointsProps> = ({pageIndex}) => {

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
      title: 'Project setup in under an hour',
      description: 'We support 26 different model types & provide simple tools to organise your logistics and create an assembly plan. From there, its all about time savings: no more drafting installation plans, no more reporting paperwork & less time spent on site.'
    },
    { 
      id: 1, 
      title: 'Artificial Intelligence in your tool belt.', 
      description: 'Enjoy predictive logistics, automated progress tracking, and AI-driven delay prevention—so you can spot issues early and keep your project on course.', 
    },
    { 
      id: 2, 
      title: 'Accessible anywhere, anytime. ', 
      description: 'Maestro Pilot is 100% web-based, allowing your teams to collaborate on model-set up, and site crews to access the latest data from any device.', 
    },
    { 
      id: 3, 
      title: 'Integrated with your infrastructure.', 
      description: 'Looking to optimise your operation, but don\'t want to substitute tried and tested tools? Inquire about seamless integration with warehousing & ERP systems.', 
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
      <div className="h-svh w-screen text-center text-white px-6">
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
                        <div
                          className='flex flex-col row-span-3 justify-center gap-3 pb-20'
                        >
                          <div
                            className='text-white font-bold text-2xl px-4 flex text-left'
                          >
                            {features[activeFeatureIndex].title}
                          </div>
                          <div
                            className='text-white font-semibold text-2xl px-4 flex text-left'
                          >
                            {features[activeFeatureIndex].description}
                          </div>
                        </div>
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

const KeyPointsDesktop: React.FC<KeyPointsProps> = ({ pageIndex }) => {
  const { isActive } = useActivePage({ pageIndex, delay: 300 });

  return (
    <div className="text-center text-white px-4">
      <AnimatePresence>
        {isActive && (
          <>            
            <div className="grid grid-rows-2 p-10 relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full my-auto top-0 bottom-0 w-px bg-white/30"></div>
              <div className="absolute top-1/2 transform -translate-y-1/2 w-full my-auto left-0 right-0 h-px bg-white/30"></div>
              <div
              >
                <div className="grid grid-cols-2 text-left text-3xl p-6">
                    <AnimatedSection 
                        direction="left" 
                        delay={0.5}
                        className='flex flex-col gap-2'
                    >
                        <p className="pr-8 font-bold">
                            Project setup in under an hour. 
                        </p>
                        <p className="pr-8">
                            We support 26 different model types & provide simple tools to organise your logistics and create an assembly plan. From there, its all about time savings: no more drafting installation plans, no more reporting paperwork & less time spent on site.
                        </p>
                    </AnimatedSection>
                    <AnimatedSection 
                        direction="right" 
                        delay={0.8}
                        className='flex flex-col gap-2'
                    >
                        <p className="pl-8 font-bold">
                            Accessible anywhere, anytime.  
                        </p>
                        <p className="pl-8">
                            Maestro Pilot is 100% web-based, allowing your teams to collaborate on model-set up, and site crews to access the latest data from any device.
                        </p>
                    </AnimatedSection>
                </div>
              </div>
                
              <div>
                <div className="grid grid-cols-2 text-left text-3xl p-6 ">
                    <AnimatedSection
                        direction='left'
                        delay={1.1}
                        className='flex flex-col gap-2'
                    >
                        <p className="pr-8 font-bold">
                            Artificial Intelligence in your tool belt.
                        </p>
                        <p className="pr-8">
                            Enjoy predictive logistics, automated progress tracking, and AI-driven delay prevention—so you can spot issues early and keep your project on course.
                        </p>
                    </AnimatedSection>
                    <AnimatedSection
                        direction="right"
                        delay={1.4}
                        className='flex flex-col gap-2'
                    >
                        <p className="pl-8 font-bold">
                            Integrated with your infrastructure.  
                        </p>
                        <p className="pl-8">
                            Looking to optimise your operation, but don't want to substitute tried and tested tools? Inquire about seamless integration with warehousing & ERP systems.
                        </p>
                    </AnimatedSection>
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KeyPoints;