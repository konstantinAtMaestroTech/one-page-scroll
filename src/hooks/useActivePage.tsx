import { useContext, useEffect, useState, useRef } from 'react';
import { PageContext } from '../components/full-page-scroll';

interface UseActivePageOptions {
  pageIndex: number;
  // Optional delay before considering the page active (in ms)
  delay?: number;
}

export const useActivePage = ({ pageIndex, delay = 0 }: UseActivePageOptions) => {
  const { activePage, totalPages, lockMainScroll, navigateToPage } = useContext(PageContext);
  const [isActive, setIsActive] = useState(false);
  const [hasBeenActive, setHasBeenActive] = useState(false);
  const [previousPage, setPreviousPage] = useState<number | null>(null);
  const previousActivePageRef = useRef(activePage);

  useEffect(() => {
    // Store the previous active page when it changes
    if (previousActivePageRef.current !== activePage) {
      setPreviousPage(previousActivePageRef.current);
      previousActivePageRef.current = activePage;
    }

    if (activePage === pageIndex) {
      // If there's a delay, wait for it
      if (delay > 0) {
        const timer = setTimeout(() => {
          setIsActive(true);
          setHasBeenActive(true);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setIsActive(true);
        setHasBeenActive(true);
      }
    } else {
      setIsActive(false);
    }
  }, [activePage, pageIndex, delay]);

  // Function to lock/unlock the main scroll functionality
  const setLockMainScroll = (lock: boolean) => {
    console.log('useActivePage lock is', lock)
    lockMainScroll(lock);
  };

  return { 
    isActive, 
    hasBeenActive, 
    setLockMainScroll, 
    activePage, 
    previousPage,
    totalPages,
    navigateToPage 
  };
};