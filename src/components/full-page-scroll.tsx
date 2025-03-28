import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import NavigationDots from './navigation-dots';
import { FullPageScrollProps, PageProps } from './types';

// Create context to share active page state with child components
export const PageContext = createContext<{
  activePage: number;
  totalPages: number;
}>({
  activePage: 0,
  totalPages: 0,
});

const FullPageScroll: React.FC<FullPageScrollProps> = ({ 
  pages, 
  transitionDuration = 1000,
  initialPage = 0,
  showNavigation = true
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll events
  const handleScroll = (event: WheelEvent): void => {
    if (isScrolling) return;
    
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
  }, [currentPage, isScrolling]);

  // Handle manual navigation
  const navigateToPage = (index: number): void => {
    if (index !== currentPage && !isScrolling) {
      setIsScrolling(true);
      setCurrentPage(index);
      setTimeout(() => setIsScrolling(false), transitionDuration);
    }
  };

  return (
    <PageContext.Provider value={{ activePage: currentPage, totalPages: pages.length }}>
      <div className="h-screen w-screen overflow-hidden relative" ref={containerRef}>
        <div 
          className="h-full w-full transition-transform duration-1000 ease-in-out"
          style={{ 
            transform: `translateY(-${currentPage * 100}%)`,
            transitionDuration: `${transitionDuration}ms`
          }}
        >
          {pages.map((page, index) => (
            <div 
              key={page.id}
              className={`h-screen w-screen flex items-center justify-center ${page.bgColor || ''} ${page.className || ''}`}
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
    </PageContext.Provider>
  );
};

export default FullPageScroll;