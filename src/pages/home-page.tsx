import React from 'react';
import {motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/animated-section';
import { useActivePage } from '../hooks/useActivePage';


interface HomePageProps {
  pageIndex: number;
}

const HomePage: React.FC<HomePageProps> = ({ pageIndex }) => {
  const { isActive, setLockMainScroll, navigateToPage } = useActivePage({ pageIndex });
  const videoRef = React.useRef<HTMLVideoElement>(null);
  // State to track which feature is highlighted
  const [activeFeatureIndex, setActiveFeatureIndex] = React.useState(0);
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
        console.log('next page')
        setIsInFeatureMode(false);
        navigateToPage(pageIndex+1)
        return prev;
      }
      // If we're at the beginning and scrolling backward, exit feature mode
      if (next < 0 && direction < 0) {
        return 0;
      }
      // Otherwise, update within bounds
      console.log('next feature')
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

  // Enter feature mode when the page becomes active
  React.useEffect(() => {
    if (isActive) {
      setIsInFeatureMode(true);
      setLockMainScroll(true); // Lock main scroll when entering feature mode
    } else {
      setIsInFeatureMode(false);
    }
  },[isActive]);

  const features = [
    { id: 1, title: 'Responsive Design', description: 'Works on all devices and screen sizes', video: './videos/cropped.mp4' },
    { id: 2, title: 'TypeScript Support', description: 'Fully typed for better development experience', video: "./videos/mobile_interface.mp4" },
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
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
      <AnimatePresence>
        {isActive && (
          <div 
            className='h-screen w-screen grid grid-rows-3'
            ref={featureContainerRef}
            onTouchStart={handleFeatureTouchStart}
            onTouchMove={handleFeatureTouchMove}
            onTouchEnd={handleFeatureTouchEnd}
          >
            <AnimatedSection
              direction='left'
              duration={1}
              delay={0.2}
              className='px-8 h-full w-full flex items-end'
            >
              <h1 className="text-7xl text-white">
                <span className="font-bold">mpower</span> your construction site with digital innovation
              </h1>
            </AnimatedSection>

            <div className='grid row-span-2 grid-cols-2'>
              <AnimatePresence
                custom={activeFeatureIndex}
                mode="wait"
              >
                {isInFeatureMode && (
                    <motion.div
                      key={features[activeFeatureIndex].id}
                      className="flex flex-col p-6"
                      custom={activeFeatureIndex > 0 ? 1 : -1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                        className='h-full'
                        loop
                        muted
                        playsInline
                      >
                        <source src="./videos/webm_transparency.webm" type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence
                custom={activeFeatureIndex}
                mode="wait"
              >
                {isInFeatureMode && (
                  <motion.div
                    key={features[activeFeatureIndex].id}
                    className="flex flex-col p-10 justify-between"
                    custom={activeFeatureIndex > 0 ? 1 : -1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <AnimatedSection delay={0.2} direction="up">
                      <p className="text-4xl text-white mb-8">
                        {features[activeFeatureIndex].title}
                      </p>
                    </AnimatedSection>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </AnimatePresence>
  );
};

export default HomePage;