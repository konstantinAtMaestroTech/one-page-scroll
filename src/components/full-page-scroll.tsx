import React, { useState, useEffect, useRef, createContext} from 'react';
import NavigationDots from './navigation-dots';
import { FullPageScrollProps} from './types';
import { useIsMobile } from '../hooks/useIsMobile';
import Header from './header';

// Create context to share active page state with child components
export const PageContext = createContext<{
  activePage: number;
  totalPages: number;
  lockMainScroll: (lock: boolean) => void;
  navigateToPage: (index: number) => void;
}>({
  activePage: 0,
  totalPages: 0,
  lockMainScroll: () => {},
  navigateToPage: () => {},
});
const logoUrl = "./maestro.png";
const FullPageScroll: React.FC<FullPageScrollProps> = ({ 
  pages, 
  transitionDuration = 1000,
  initialPage = 0,
  showNavigation = true
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [mainScrollLocked, setMainScrollLocked] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile()

  // Variables to track touch movements
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const isScrollingRef = useRef(isScrolling);

  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);


  // Handle touch start event
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
    setTouchEnd(null);
  };

  // Handle touch move event
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isScrolling || mainScrollLocked) return;
    
    // Calculate distance of the swipe
    const distance = touchStart - touchEnd;
    const isSignificantSwipe = Math.abs(distance) >= minSwipeDistance;
    
    if (isSignificantSwipe) {
      setIsScrolling(true);
      
      // Determine direction (positive = swipe up = move down)
      const direction = distance > 0 ? 1 : -1;
      
      // Calculate the next page index
      const nextPage = Math.min(Math.max(currentPage + direction, 0), pages.length - 1);
      
      if (nextPage !== currentPage) {
        setCurrentPage(nextPage);
      }
      
      // Reset scroll lock after animation completes
      setTimeout(() => {
        setIsScrolling(false);
      }, transitionDuration);
    }
    
    // Reset touch values
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // Function to allow child components to lock/unlock the main scroll
  const lockMainScroll = (lock: boolean) => {
    setMainScrollLocked(lock);
  };
  
  // Handle scroll events
  const handleScroll = (event: WheelEvent): void => {
    if (isScrolling || mainScrollLocked) return;
    
    event.preventDefault();
    setIsScrolling(true);
    
    // Determine scroll direction
    const direction = event.deltaY > 0 ? 1 : -1;
    
    // Calculate next page index
    const nextPage = Math.min(Math.max(currentPage + direction, 0), pages.length - 1);
    
    if (nextPage !== currentPage) {
      setCurrentPage(nextPage);
    }
    
    // Reset scroll lock after animation completes
    setTimeout(() => {
      setIsScrolling(false);
    }, transitionDuration);
  };

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    
    const wheelHandler = (e: WheelEvent) => handleScroll(e);
    
    if (container) {
      container.addEventListener('wheel', wheelHandler, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', wheelHandler);
      };
    }
  }, [currentPage, isScrolling, mainScrollLocked]);

  // Handle manual navigation
  const navigateToPage = (index: number): void => {
    if (index !== currentPage && !isScrollingRef.current) {
      setIsScrolling(true);
      setCurrentPage(index);
      setTimeout(() => setIsScrolling(false), transitionDuration);
    }
  };
  return (
    <PageContext.Provider value={{ 
      activePage: currentPage, 
      totalPages: pages.length,
      lockMainScroll,
      navigateToPage
    }}>
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Header logoSrc={logoUrl} />
        <div 
          className={`${isMobile ? 'h-fit' : 'h-screen'} w-screen overflow-hidden relative`}

          ref={containerRef}
        >
          <div 
            className={`${isMobile ? 'h-svh' : 'h-full'} w-full transition-transform duration-1000 ease-in-out`}
            style={{ 
              transform: `translateY(-${currentPage * 100}${isMobile ? 'svh' : '%'})`,
              transitionDuration: `${transitionDuration}ms`
            }}
          >
            {pages.map((page) => (
              <div 
                key={page.id}
                className={`h-svh w-screen flex items-center justify-center ${page.bgColor || ''} ${page.className || ''} pb-[env(safe-area-inset-bottom)]`}
              >
                {page.children}
              </div>
            ))}
          </div>
          
          {showNavigation && (
            <NavigationDots 
              pages={pages} 
              currentPage={currentPage} 
              navigateToPage={navigateToPage} 
            />
          )}
      </div>
    </div>
    </PageContext.Provider>
  );
};

export default FullPageScroll;